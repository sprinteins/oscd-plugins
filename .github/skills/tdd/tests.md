# Good and Bad Tests

## Good Tests

**Integration-style**: Test through real interfaces, not mocks of internal parts.

```typescript
// GOOD: Tests observable behavior
test('user can checkout with valid cart', async () => {
	const cart = createCart()
	cart.add(product)
	const result = await checkout(cart, paymentMethod)
	expect(result.status).toBe('confirmed')
})
```

Characteristics:

- Tests behavior users/callers care about
- Uses public API only
- Survives internal refactors
- Describes WHAT, not HOW
- One logical assertion per test

## Bad Tests

**Implementation-detail tests**: Coupled to internal structure.

```typescript
// BAD: Tests implementation details
test('checkout calls paymentService.process', async () => {
	const mockPayment = jest.mock(paymentService)
	await checkout(cart, payment)
	expect(mockPayment.process).toHaveBeenCalledWith(cart.total)
})
```

Red flags:

- Mocking internal collaborators
- Testing private methods
- Asserting on call counts/order
- Test breaks when refactoring without behavior change
- Test name describes HOW not WHAT
- Verifying through external means instead of interface

```typescript
// BAD: Bypasses interface to verify
test('createUser saves to database', async () => {
	await createUser({ name: 'Alice' })
	const row = await db.query('SELECT * FROM users WHERE name = ?', ['Alice'])
	expect(row).toBeDefined()
})

// GOOD: Verifies through interface
test('createUser makes user retrievable', async () => {
	const user = await createUser({ name: 'Alice' })
	const retrieved = await getUser(user.id)
	expect(retrieved.name).toBe('Alice')
})
```

## SET Project Tests: XML + XPath + Table-Driven

See the [table-driven-tdd skill](../../table-driven-tdd/SKILL.md) for the full pattern, helpers, and readability conventions.

### Good

Use `runSclTestCases` from `@dialecte/scl/test`. Case key: `<initial state> → <outcome>`.

```typescript
// GOOD: XML in, XPath assertions out — table-driven
import { runSclTestCases } from '@dialecte/scl/test'
runSclTestCases({
  testCases: {
    'VoltageLevel missing → created under Substation': {
      sourceXml: `<SCL xmlns="http://www.iec.ch/61850/2003/SCL"><Substation name="S1" dev:db-id="s1"/></SCL>`,
      expectedQueries: ['//scl:Substation[@name="S1"]/scl:VoltageLevel[@name="VL1"]'],
    },
  },
  async act({ source }) {
    // ...
    return { assertDatabaseName: source.databaseName }
  },
})

runTests(testCases, testFunction)
  	//
  	// Arrange
  	//
  	const sclFile = new File([tc.initialXml], `test-${crypto.randomUUID()}.ssd`, { type: 'application/xml' })
  	const [sclFileName] = await importXmlFiles({ files: [sclFile] })

	//
  	// Act
	/
  	await instantiateFunction(sclFileName)

	//
  	// Assert
	//
	const { xmlDocument } = await exportFile({ databaseName: sclFileName })
	assertExpectedElementQueries(xmlDocument, tc.expectedElementQueries)
})
```

### Bad

```typescript
// BAD: String comparison — brittle, breaks on UUID or whitespace differences
test('instantiateFunction adds Bay', async () => {
	const result = await instantiateFunction(scl)
	expect(result).toBe(`<SCL><Substation name="S1">...</SCL>`)
})

// BAD: CSS queries — fails on XML namespaces
test('instantiateFunction adds Bay', async () => {
	const result = await instantiateFunction(scl)
	expect(result.querySelector('Bay[name="Q01"]')).not.toBeNull()
})

// BAD: Tests internal JSON structure instead of XML interface
test('instantiateFunction stores bay in DB', async () => {
	await instantiateFunction(scl)
	const row = await db.find({ type: 'Bay', name: 'Q01' })
	expect(row).toBeDefined()
})
```
