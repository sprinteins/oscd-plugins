export const autoDocIdentifier = 'AUTO_DOC'

export function queryAutoDocElement(xmlDocument: Document): Element | null {
    return xmlDocument.documentElement.querySelector(`Private[type="${autoDocIdentifier}"]`)
}

export function queryDataSetForControl(control: Element): Element | null {
    const dataSetName = control.getAttribute('datSet');
    return control.parentElement?.querySelector(`:scope > DataSet[name="${dataSetName}"]`) ?? null;
}

export function queryLDevice(accessPoint: Element, inst: string): Element | null {
    return accessPoint.querySelector(
      `:scope > Server > LDevice[inst="${inst}"]`
    );
}

export function buildLNQuery(
  lnClass: string,
  inst: string,
  prefix: string | null
): string {
  if (lnClass === 'LLN0') {
    return `:scope > LN0[lnClass="${lnClass}"]`;
  }

  let lnQuery = `:scope > LN[lnClass="${lnClass}"][inst="${inst}"]`;
  
  if (prefix) {
    lnQuery += `[prefix="${prefix}"]`;
  } else {
    lnQuery += `:not([prefix]), ${lnQuery}[prefix=""]`;
  }

  return lnQuery;
}

export function queryLN(
    lDevice: Element,
    lnClass: string,
    inst: string,
    prefix: string | null
  ): Element | null {
    const query = buildLNQuery(lnClass, inst, prefix);
    return lDevice.querySelector(query);
}

