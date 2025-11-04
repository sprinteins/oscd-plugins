help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

core: _install ## Start core (legacy) tests in watch mode
	pnpm -C ./packages/core/legacy run test:watch

uilib: _install ## Start UI-Lib in dev mode
	pnpm -C ./packages/uilib run dev

auto-doc: _install ## Start the AutoDoc plugin in dev mode
	pnpm -C ./packages/plugins/auto-doc run build:watch

communication-explorer: _install ## Start the communication explorer plugin in dev mode
	pnpm -C ./packages/plugins/communication-explorer run build:watch

diffing-tool: _install ## Start the diffing tool plugin in dev mode
	pnpm -C ./packages/plugins/diffing-tool run build:watch

documentation: _install ## Start the documentation plugin in dev mode
	pnpm -C ./packages/plugins/documentation run build:watch

io-center: _install ## Start the I/O center plugin in dev mode
	pnpm -C ./packages/plugins/io-center run build:watch

network-explorer: _install ## Start the network explorer plugin in dev mode
	pnpm -C ./packages/plugins/network-explorer run build:watch

type-designer: _install ## Start the type designer plugin in dev mode
	pnpm -C ./packages/plugins/type-designer run build:watch

type-switcher: _install ## Start the type switcher plugin in dev mode
	pnpm -C ./packages/plugins/type-switcher run build:watch

fix: _install ## Fix biome errors
	pnpm biome:fix
	
uilib-tests: _install
	(cd ./packages/uilib ; pnpm test:unit)

plugins: communication-explorer # shortcut

_install:
	pnpm i --frozen-lockfile && pnpm dependencies:build

start-scd:
	bash ./_scripts/run-openscd.sh