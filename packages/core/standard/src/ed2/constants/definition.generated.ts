
/**
 * This file is auto-generated. Do not edit it directly.
 * Last generated at 2025-01-09T13:17:05.480Z
 */

const generated = {
  communication: {
    tag: "Communication",
    anyAllowed: {
      attributes: false,
      subElements: false
    },
    attributes: {},
    subElements: {}
  },
  dataTypeTemplates: {
    tag: "DataTypeTemplates",
    anyAllowed: {
      attributes: false,
      subElements: false
    },
    attributes: {},
    subElements: {
      lNodeType: {
        required: false,
        array: true
      },
      dOType: {
        required: false,
        array: true
      },
      dAType: {
        required: false,
        array: true
      },
      enumType: {
        required: false,
        array: true
      }
    }
  },
  lNodeType: {
    tag: "LNodeType",
    anyAllowed: {
      attributes: true,
      subElements: false
    },
    attributes: {
      desc: {
        required: false,
        types: [
          "string ",
          " undefined"
        ]
      },
      id: {
        required: true,
        types: [
          "string"
        ]
      },
      iedType: {
        required: false,
        types: [
          "string ",
          " undefined"
        ]
      },
      lnClass: {
        required: true,
        types: [
          "import(\"/Users/m.guerin/Documents/TransnetBW/openscd/plugins/packages/core/standard/src/ed2/definition/shared/types.lnClass\").LNClass.SystemGroup ",
          " import(\"/Users/m.guerin/Documents/TransnetBW/openscd/plugins/packages/core/standard/src/ed2/definition/shared/types.lnClass\").LNClass.DomainGroupA ",
          " import(\"/Users/m.guerin/Documents/TransnetBW/openscd/plugins/packages/core/standard/src/ed2/definition/shared/types.lnClass\").LNClass.DomainGroupC ",
          " import(\"/Users/m.guerin/Documents/TransnetBW/openscd/plugins/packages/core/standard/src/ed2/definition/shared/types.lnClass\").LNClass.DomainGroupF ",
          " import(\"/Users/m.guerin/Documents/TransnetBW/openscd/plugins/packages/core/standard/src/ed2/definition/shared/types.lnClass\").LNClass.DomainGroupG ",
          " import(\"/Users/m.guerin/Documents/TransnetBW/openscd/plugins/packages/core/standard/src/ed2/definition/shared/types.lnClass\").LNClass.DomainGroupI ",
          " import(\"/Users/m.guerin/Documents/TransnetBW/openscd/plugins/packages/core/standard/src/ed2/definition/shared/types.lnClass\").LNClass.DomainGroupK ",
          " import(\"/Users/m.guerin/Documents/TransnetBW/openscd/plugins/packages/core/standard/src/ed2/definition/shared/types.lnClass\").LNClass.DomainGroupM ",
          " import(\"/Users/m.guerin/Documents/TransnetBW/openscd/plugins/packages/core/standard/src/ed2/definition/shared/types.lnClass\").LNClass.DomainGroupP ",
          " import(\"/Users/m.guerin/Documents/TransnetBW/openscd/plugins/packages/core/standard/src/ed2/definition/shared/types.lnClass\").LNClass.DomainGroupQ ",
          " import(\"/Users/m.guerin/Documents/TransnetBW/openscd/plugins/packages/core/standard/src/ed2/definition/shared/types.lnClass\").LNClass.DomainGroupR ",
          " import(\"/Users/m.guerin/Documents/TransnetBW/openscd/plugins/packages/core/standard/src/ed2/definition/shared/types.lnClass\").LNClass.DomainGroupS ",
          " import(\"/Users/m.guerin/Documents/TransnetBW/openscd/plugins/packages/core/standard/src/ed2/definition/shared/types.lnClass\").LNClass.DomainGroupT ",
          " import(\"/Users/m.guerin/Documents/TransnetBW/openscd/plugins/packages/core/standard/src/ed2/definition/shared/types.lnClass\").LNClass.DomainGroupX ",
          " import(\"/Users/m.guerin/Documents/TransnetBW/openscd/plugins/packages/core/standard/src/ed2/definition/shared/types.lnClass\").LNClass.DomainGroupY ",
          " import(\"/Users/m.guerin/Documents/TransnetBW/openscd/plugins/packages/core/standard/src/ed2/definition/shared/types.lnClass\").LNClass.DomainGroupZ"
        ]
      }
    },
    subElements: {
      text: {
        required: false,
        array: false
      },
      private: {
        required: false,
        array: true
      },
      dO: {
        required: false,
        array: true
      }
    }
  },
  dOType: {
    tag: "DOType",
    anyAllowed: {
      attributes: true,
      subElements: false
    },
    attributes: {
      desc: {
        required: false,
        types: [
          "string ",
          " undefined"
        ]
      },
      id: {
        required: true,
        types: [
          "string"
        ]
      },
      iedType: {
        required: false,
        types: [
          "string ",
          " undefined"
        ]
      },
      cdc: {
        required: true,
        types: [
          "\"SPS\" ",
          " \"DPS\" ",
          " \"INS\" ",
          " \"ENS\" ",
          " \"ACT\" ",
          " \"ACD\" ",
          " \"SEC\" ",
          " \"BCR\" ",
          " \"HST\" ",
          " \"VSS\" ",
          " \"MV\" ",
          " \"CMV\" ",
          " \"SAV\" ",
          " \"WYE\" ",
          " \"DEL\" ",
          " \"SEQ\" ",
          " \"HMV\" ",
          " \"HWYE\" ",
          " \"HDEL\" ",
          " \"SPC\" ",
          " \"DPC\" ",
          " \"INC\" ",
          " \"ENC\" ",
          " \"BSC\" ",
          " \"ISC\" ",
          " \"APC\" ",
          " \"BAC\" ",
          " \"SPG\" ",
          " \"ING\" ",
          " \"ENG\" ",
          " \"ORG\" ",
          " \"TSG\" ",
          " \"CUG\" ",
          " \"VSG\" ",
          " \"ASG\" ",
          " \"CURVE\" ",
          " \"CSG\" ",
          " \"DPL\" ",
          " \"LPL\" ",
          " \"CSD\" ",
          " \"CST\" ",
          " \"BTS\" ",
          " \"UTS\" ",
          " \"LTS\" ",
          " \"GTS\" ",
          " \"MTS\" ",
          " \"NTS\" ",
          " \"STS\" ",
          " \"CTS\" ",
          " \"OTS\" ",
          " \"VSD\" ",
          " \"ORS\" ",
          " \"TCS\""
        ]
      }
    },
    subElements: {
      text: {
        required: false,
        array: false
      },
      private: {
        required: false,
        array: true
      },
      sDO: {
        required: false,
        array: true
      },
      dA: {
        required: false,
        array: true
      }
    }
  },
  dAType: {
    tag: "DAType",
    anyAllowed: {
      attributes: true,
      subElements: false
    },
    attributes: {
      desc: {
        required: false,
        types: [
          "string ",
          " undefined"
        ]
      },
      id: {
        required: true,
        types: [
          "string"
        ]
      },
      iedType: {
        required: false,
        types: [
          "string ",
          " undefined"
        ]
      }
    },
    subElements: {
      text: {
        required: false,
        array: false
      },
      private: {
        required: false,
        array: true
      },
      bDA: {
        required: false,
        array: true
      },
      protNs: {
        required: false,
        array: true
      }
    }
  },
  enumType: {
    tag: "EnumType",
    anyAllowed: {
      attributes: true,
      subElements: false
    },
    attributes: {
      desc: {
        required: false,
        types: [
          "string ",
          " undefined"
        ]
      },
      id: {
        required: true,
        types: [
          "string"
        ]
      }
    },
    subElements: {
      text: {
        required: false,
        array: false
      },
      private: {
        required: false,
        array: true
      },
      enumVal: {
        required: false,
        array: true
      }
    }
  },
  dO: {
    tag: "DO",
    anyAllowed: {
      attributes: true,
      subElements: false
    },
    attributes: {
      desc: {
        required: false,
        types: [
          "string ",
          " undefined"
        ]
      },
      name: {
        required: true,
        types: [
          "string"
        ]
      },
      type: {
        required: true,
        types: [
          "string"
        ]
      },
      accessControl: {
        required: false,
        types: [
          "string ",
          " undefined"
        ]
      },
      transient: {
        required: false,
        types: [
          "\"false\" ",
          " \"true\" ",
          " undefined"
        ]
      }
    },
    subElements: {
      text: {
        required: false,
        array: false
      },
      private: {
        required: false,
        array: true
      }
    }
  },
  sDO: {
    tag: "SDO",
    anyAllowed: {
      attributes: true,
      subElements: false
    },
    attributes: {
      desc: {
        required: false,
        types: [
          "string ",
          " undefined"
        ]
      },
      name: {
        required: true,
        types: [
          "string"
        ]
      },
      type: {
        required: true,
        types: [
          "string"
        ]
      },
      count: {
        required: false,
        types: [
          "string ",
          " undefined"
        ]
      }
    },
    subElements: {
      text: {
        required: false,
        array: false
      },
      private: {
        required: false,
        array: true
      }
    }
  },
  protNs: {
    tag: "ProtNs",
    anyAllowed: {
      attributes: false,
      subElements: false
    },
    attributes: {
      type: {
        required: false,
        types: [
          "string ",
          " undefined"
        ]
      }
    },
    subElements: {}
  },
  val: {
    tag: "Val",
    anyAllowed: {
      attributes: true,
      subElements: false
    },
    attributes: {
      desc: {
        required: false,
        types: [
          "string ",
          " undefined"
        ]
      },
      sGroup: {
        required: false,
        types: [
          "`${number}` ",
          " undefined"
        ]
      }
    },
    subElements: {
      text: {
        required: false,
        array: false
      },
      private: {
        required: false,
        array: true
      }
    }
  },
  enumVal: {
    tag: "EnumVal",
    anyAllowed: {
      attributes: false,
      subElements: false
    },
    attributes: {
      ord: {
        required: true,
        types: [
          "`${number}`"
        ]
      },
      desc: {
        required: false,
        types: [
          "string ",
          " undefined"
        ]
      }
    },
    subElements: {}
  },
  header: {
    tag: "Header",
    anyAllowed: {
      attributes: false,
      subElements: false
    },
    attributes: {
      id: {
        required: true,
        types: [
          "string"
        ]
      },
      version: {
        required: false,
        types: [
          "string ",
          " undefined"
        ]
      },
      revision: {
        required: false,
        types: [
          "string ",
          " undefined"
        ]
      },
      toolID: {
        required: false,
        types: [
          "string ",
          " undefined"
        ]
      },
      nameStructure: {
        required: false,
        types: [
          "\"IEDName\" ",
          " undefined"
        ]
      }
    },
    subElements: {
      text: {
        required: false,
        array: false
      },
      history: {
        required: false,
        array: false
      }
    }
  },
  history: {
    tag: "History",
    anyAllowed: {
      attributes: false,
      subElements: false
    },
    attributes: {},
    subElements: {
      hItem: {
        required: false,
        array: true
      }
    }
  },
  historyItem: {
    tag: "Hitem",
    anyAllowed: {
      attributes: false,
      subElements: false
    },
    attributes: {
      version: {
        required: true,
        types: [
          "string"
        ]
      },
      revision: {
        required: true,
        types: [
          "string"
        ]
      },
      when: {
        required: true,
        types: [
          "string"
        ]
      },
      who: {
        required: false,
        types: [
          "string ",
          " undefined"
        ]
      },
      what: {
        required: false,
        types: [
          "string ",
          " undefined"
        ]
      },
      why: {
        required: false,
        types: [
          "string ",
          " undefined"
        ]
      }
    },
    subElements: {}
  },
  ied: {
    tag: "IED",
    anyAllowed: {
      attributes: false,
      subElements: false
    },
    attributes: {},
    subElements: {}
  },
  line: {
    tag: "Line",
    anyAllowed: {
      attributes: false,
      subElements: false
    },
    attributes: {},
    subElements: {}
  },
  process: {
    tag: "Process",
    anyAllowed: {
      attributes: false,
      subElements: false
    },
    attributes: {},
    subElements: {}
  },
  scl: {
    tag: "SCL",
    anyAllowed: {
      attributes: true,
      subElements: false
    },
    attributes: {
      version: {
        required: true,
        types: [
          "import(\"/Users/m.guerin/Documents/TransnetBW/openscd/plugins/packages/core/standard/src/ed2/definition/scl/types.scl\").Scl.SclVersion"
        ]
      },
      revision: {
        required: true,
        types: [
          "import(\"/Users/m.guerin/Documents/TransnetBW/openscd/plugins/packages/core/standard/src/ed2/definition/scl/types.scl\").Scl.SclRevision"
        ]
      },
      release: {
        required: true,
        types: [
          "import(\"/Users/m.guerin/Documents/TransnetBW/openscd/plugins/packages/core/standard/src/ed2/definition/scl/types.scl\").Scl.SclRelease"
        ]
      }
    },
    subElements: {
      text: {
        required: false,
        array: false
      },
      private: {
        required: false,
        array: true
      },
      header: {
        required: false,
        array: false
      },
      substation: {
        required: false,
        array: true
      },
      communication: {
        required: false,
        array: false
      },
      ied: {
        required: false,
        array: true
      },
      dataTypeTemplates: {
        required: false,
        array: false
      },
      line: {
        required: false,
        array: true
      },
      process: {
        required: false,
        array: true
      }
    }
  },
  anyElement: {
    tag: "",
    anyAllowed: {
      attributes: false,
      subElements: false
    },
    attributes: {},
    subElements: {}
  },
  text: {
    tag: "Text",
    anyAllowed: {
      attributes: false,
      subElements: false
    },
    attributes: {
      source: {
        required: false,
        types: [
          "string ",
          " undefined"
        ]
      }
    },
    subElements: {}
  },
  private: {
    tag: "Private",
    anyAllowed: {
      attributes: false,
      subElements: false
    },
    attributes: {
      type: {
        required: true,
        types: [
          "string"
        ]
      },
      source: {
        required: false,
        types: [
          "string ",
          " undefined"
        ]
      }
    },
    subElements: {}
  },
  generalEquipment: {
    tag: "GeneralEquipment",
    anyAllowed: {
      attributes: true,
      subElements: false
    },
    attributes: {
      desc: {
        required: false,
        types: [
          "string ",
          " undefined"
        ]
      },
      name: {
        required: true,
        types: [
          "string"
        ]
      },
      virtual: {
        required: false,
        types: [
          "\"false\" ",
          " \"true\" ",
          " undefined"
        ]
      },
      type: {
        required: true,
        types: [
          "\"AXN\" ",
          " \"BAT\" ",
          " \"MOT\" ",
          " \"FAN\" ",
          " \"FIL\" ",
          " \"PMP\" ",
          " \"TNK\" ",
          " \"VLV\" ",
          " `EAA${string}` ",
          " `EAB${string}` ",
          " `EAC${string}` ",
          " `EAD${string}` ",
          " `EAE${string}` ",
          " `EAF${string}` ",
          " `EAG${string}` ",
          " `EAH${string}` ",
          " `EAI${string}` ",
          " `EAJ${string}` ",
          " `EAK${string}` ",
          " `EAL${string}` ",
          " `EAM${string}` ",
          " `EAN${string}` ",
          " `EAO${string}` ",
          " `EAP${string}` ",
          " `EAQ${string}` ",
          " `EAR${string}` ",
          " `EAS${string}` ",
          " `EAT${string}` ",
          " `EAU${string}` ",
          " `EAV${string}` ",
          " `EAW${string}` ",
          " `EAX${string}` ",
          " `EAY${string}` ",
          " `EAZ${string}` ",
          " `EBA${string}` ",
          " `EBB${string}` ",
          " `EBC${string}` ",
          " `EBD${string}` ",
          " `EBE${string}` ",
          " `EBF${string}` ",
          " `EBG${string}` ",
          " `EBH${string}` ",
          " `EBI${string}` ",
          " `EBJ${string}` ",
          " `EBK${string}` ",
          " `EBL${string}` ",
          " `EBM${string}` ",
          " `EBN${string}` ",
          " `EBO${string}` ",
          " `EBP${string}` ",
          " `EBQ${string}` ",
          " `EBR${string}` ",
          " `EBS${string}` ",
          " `EBT${string}` ",
          " `EBU${string}` ",
          " `EBV${string}` ",
          " `EBW${string}` ",
          " `EBX${string}` ",
          " `EBY${string}` ",
          " `EBZ${string}` ",
          " `ECA${string}` ",
          " `ECB${string}` ",
          " `ECC${string}` ",
          " `ECD${string}` ",
          " `ECE${string}` ",
          " `ECF${string}` ",
          " `ECG${string}` ",
          " `ECH${string}` ",
          " `ECI${string}` ",
          " `ECJ${string}` ",
          " `ECK${string}` ",
          " `ECL${string}` ",
          " `ECM${string}` ",
          " `ECN${string}` ",
          " `ECO${string}` ",
          " `ECP${string}` ",
          " `ECQ${string}` ",
          " `ECR${string}` ",
          " `ECS${string}` ",
          " `ECT${string}` ",
          " `ECU${string}` ",
          " `ECV${string}` ",
          " `ECW${string}` ",
          " `ECX${string}` ",
          " `ECY${string}` ",
          " `ECZ${string}` ",
          " `EDA${string}` ",
          " `EDB${string}` ",
          " `EDC${string}` ",
          " `EDD${string}` ",
          " `EDE${string}` ",
          " `EDF${string}` ",
          " `EDG${string}` ",
          " `EDH${string}` ",
          " `EDI${string}` ",
          " `EDJ${string}` ",
          " `EDK${string}` ",
          " `EDL${string}` ",
          " `EDM${string}` ",
          " `EDN${string}` ",
          " `EDO${string}` ",
          " `EDP${string}` ",
          " `EDQ${string}` ",
          " `EDR${string}` ",
          " `EDS${string}` ",
          " `EDT${string}` ",
          " `EDU${string}` ",
          " `EDV${string}` ",
          " `EDW${string}` ",
          " `EDX${string}` ",
          " `EDY${string}` ",
          " `EDZ${string}` ",
          " `EEA${string}` ",
          " `EEB${string}` ",
          " `EEC${string}` ",
          " `EED${string}` ",
          " `EEE${string}` ",
          " `EEF${string}` ",
          " `EEG${string}` ",
          " `EEH${string}` ",
          " `EEI${string}` ",
          " `EEJ${string}` ",
          " `EEK${string}` ",
          " `EEL${string}` ",
          " `EEM${string}` ",
          " `EEN${string}` ",
          " `EEO${string}` ",
          " `EEP${string}` ",
          " `EEQ${string}` ",
          " `EER${string}` ",
          " `EES${string}` ",
          " `EET${string}` ",
          " `EEU${string}` ",
          " `EEV${string}` ",
          " `EEW${string}` ",
          " `EEX${string}` ",
          " `EEY${string}` ",
          " `EEZ${string}` ",
          " `EFA${string}` ",
          " `EFB${string}` ",
          " `EFC${string}` ",
          " `EFD${string}` ",
          " `EFE${string}` ",
          " `EFF${string}` ",
          " `EFG${string}` ",
          " `EFH${string}` ",
          " `EFI${string}` ",
          " `EFJ${string}` ",
          " `EFK${string}` ",
          " `EFL${string}` ",
          " `EFM${string}` ",
          " `EFN${string}` ",
          " `EFO${string}` ",
          " `EFP${string}` ",
          " `EFQ${string}` ",
          " `EFR${string}` ",
          " `EFS${string}` ",
          " `EFT${string}` ",
          " `EFU${string}` ",
          " `EFV${string}` ",
          " `EFW${string}` ",
          " `EFX${string}` ",
          " `EFY${string}` ",
          " `EFZ${string}` ",
          " `EGA${string}` ",
          " `EGB${string}` ",
          " `EGC${string}` ",
          " `EGD${string}` ",
          " `EGE${string}` ",
          " `EGF${string}` ",
          " `EGG${string}` ",
          " `EGH${string}` ",
          " `EGI${string}` ",
          " `EGJ${string}` ",
          " `EGK${string}` ",
          " `EGL${string}` ",
          " `EGM${string}` ",
          " `EGN${string}` ",
          " `EGO${string}` ",
          " `EGP${string}` ",
          " `EGQ${string}` ",
          " `EGR${string}` ",
          " `EGS${string}` ",
          " `EGT${string}` ",
          " `EGU${string}` ",
          " `EGV${string}` ",
          " `EGW${string}` ",
          " `EGX${string}` ",
          " `EGY${string}` ",
          " `EGZ${string}` ",
          " `EHA${string}` ",
          " `EHB${string}` ",
          " `EHC${string}` ",
          " `EHD${string}` ",
          " `EHE${string}` ",
          " `EHF${string}` ",
          " `EHG${string}` ",
          " `EHH${string}` ",
          " `EHI${string}` ",
          " `EHJ${string}` ",
          " `EHK${string}` ",
          " `EHL${string}` ",
          " `EHM${string}` ",
          " `EHN${string}` ",
          " `EHO${string}` ",
          " `EHP${string}` ",
          " `EHQ${string}` ",
          " `EHR${string}` ",
          " `EHS${string}` ",
          " `EHT${string}` ",
          " `EHU${string}` ",
          " `EHV${string}` ",
          " `EHW${string}` ",
          " `EHX${string}` ",
          " `EHY${string}` ",
          " `EHZ${string}` ",
          " `EIA${string}` ",
          " `EIB${string}` ",
          " `EIC${string}` ",
          " `EID${string}` ",
          " `EIE${string}` ",
          " `EIF${string}` ",
          " `EIG${string}` ",
          " `EIH${string}` ",
          " `EII${string}` ",
          " `EIJ${string}` ",
          " `EIK${string}` ",
          " `EIL${string}` ",
          " `EIM${string}` ",
          " `EIN${string}` ",
          " `EIO${string}` ",
          " `EIP${string}` ",
          " `EIQ${string}` ",
          " `EIR${string}` ",
          " `EIS${string}` ",
          " `EIT${string}` ",
          " `EIU${string}` ",
          " `EIV${string}` ",
          " `EIW${string}` ",
          " `EIX${string}` ",
          " `EIY${string}` ",
          " `EIZ${string}` ",
          " `EJA${string}` ",
          " `EJB${string}` ",
          " `EJC${string}` ",
          " `EJD${string}` ",
          " `EJE${string}` ",
          " `EJF${string}` ",
          " `EJG${string}` ",
          " `EJH${string}` ",
          " `EJI${string}` ",
          " `EJJ${string}` ",
          " `EJK${string}` ",
          " `EJL${string}` ",
          " `EJM${string}` ",
          " `EJN${string}` ",
          " `EJO${string}` ",
          " `EJP${string}` ",
          " `EJQ${string}` ",
          " `EJR${string}` ",
          " `EJS${string}` ",
          " `EJT${string}` ",
          " `EJU${string}` ",
          " `EJV${string}` ",
          " `EJW${string}` ",
          " `EJX${string}` ",
          " `EJY${string}` ",
          " `EJZ${string}` ",
          " `EKA${string}` ",
          " `EKB${string}` ",
          " `EKC${string}` ",
          " `EKD${string}` ",
          " `EKE${string}` ",
          " `EKF${string}` ",
          " `EKG${string}` ",
          " `EKH${string}` ",
          " `EKI${string}` ",
          " `EKJ${string}` ",
          " `EKK${string}` ",
          " `EKL${string}` ",
          " `EKM${string}` ",
          " `EKN${string}` ",
          " `EKO${string}` ",
          " `EKP${string}` ",
          " `EKQ${string}` ",
          " `EKR${string}` ",
          " `EKS${string}` ",
          " `EKT${string}` ",
          " `EKU${string}` ",
          " `EKV${string}` ",
          " `EKW${string}` ",
          " `EKX${string}` ",
          " `EKY${string}` ",
          " `EKZ${string}` ",
          " `ELA${string}` ",
          " `ELB${string}` ",
          " `ELC${string}` ",
          " `ELD${string}` ",
          " `ELE${string}` ",
          " `ELF${string}` ",
          " `ELG${string}` ",
          " `ELH${string}` ",
          " `ELI${string}` ",
          " `ELJ${string}` ",
          " `ELK${string}` ",
          " `ELL${string}` ",
          " `ELM${string}` ",
          " `ELN${string}` ",
          " `ELO${string}` ",
          " `ELP${string}` ",
          " `ELQ${string}` ",
          " `ELR${string}` ",
          " `ELS${string}` ",
          " `ELT${string}` ",
          " `ELU${string}` ",
          " `ELV${string}` ",
          " `ELW${string}` ",
          " `ELX${string}` ",
          " `ELY${string}` ",
          " `ELZ${string}` ",
          " `EMA${string}` ",
          " `EMB${string}` ",
          " `EMC${string}` ",
          " `EMD${string}` ",
          " `EME${string}` ",
          " `EMF${string}` ",
          " `EMG${string}` ",
          " `EMH${string}` ",
          " `EMI${string}` ",
          " `EMJ${string}` ",
          " `EMK${string}` ",
          " `EML${string}` ",
          " `EMM${string}` ",
          " `EMN${string}` ",
          " `EMO${string}` ",
          " `EMP${string}` ",
          " `EMQ${string}` ",
          " `EMR${string}` ",
          " `EMS${string}` ",
          " `EMT${string}` ",
          " `EMU${string}` ",
          " `EMV${string}` ",
          " `EMW${string}` ",
          " `EMX${string}` ",
          " `EMY${string}` ",
          " `EMZ${string}` ",
          " `ENA${string}` ",
          " `ENB${string}` ",
          " `ENC${string}` ",
          " `END${string}` ",
          " `ENE${string}` ",
          " `ENF${string}` ",
          " `ENG${string}` ",
          " `ENH${string}` ",
          " `ENI${string}` ",
          " `ENJ${string}` ",
          " `ENK${string}` ",
          " `ENL${string}` ",
          " `ENM${string}` ",
          " `ENN${string}` ",
          " `ENO${string}` ",
          " `ENP${string}` ",
          " `ENQ${string}` ",
          " `ENR${string}` ",
          " `ENS${string}` ",
          " `ENT${string}` ",
          " `ENU${string}` ",
          " `ENV${string}` ",
          " `ENW${string}` ",
          " `ENX${string}` ",
          " `ENY${string}` ",
          " `ENZ${string}` ",
          " `EOA${string}` ",
          " `EOB${string}` ",
          " `EOC${string}` ",
          " `EOD${string}` ",
          " `EOE${string}` ",
          " `EOF${string}` ",
          " `EOG${string}` ",
          " `EOH${string}` ",
          " `EOI${string}` ",
          " `EOJ${string}` ",
          " `EOK${string}` ",
          " `EOL${string}` ",
          " `EOM${string}` ",
          " `EON${string}` ",
          " `EOO${string}` ",
          " `EOP${string}` ",
          " `EOQ${string}` ",
          " `EOR${string}` ",
          " `EOS${string}` ",
          " `EOT${string}` ",
          " `EOU${string}` ",
          " `EOV${string}` ",
          " `EOW${string}` ",
          " `EOX${string}` ",
          " `EOY${string}` ",
          " `EOZ${string}` ",
          " `EPA${string}` ",
          " `EPB${string}` ",
          " `EPC${string}` ",
          " `EPD${string}` ",
          " `EPE${string}` ",
          " `EPF${string}` ",
          " `EPG${string}` ",
          " `EPH${string}` ",
          " `EPI${string}` ",
          " `EPJ${string}` ",
          " `EPK${string}` ",
          " `EPL${string}` ",
          " `EPM${string}` ",
          " `EPN${string}` ",
          " `EPO${string}` ",
          " `EPP${string}` ",
          " `EPQ${string}` ",
          " `EPR${string}` ",
          " `EPS${string}` ",
          " `EPT${string}` ",
          " `EPU${string}` ",
          " `EPV${string}` ",
          " `EPW${string}` ",
          " `EPX${string}` ",
          " `EPY${string}` ",
          " `EPZ${string}` ",
          " `EQA${string}` ",
          " `EQB${string}` ",
          " `EQC${string}` ",
          " `EQD${string}` ",
          " `EQE${string}` ",
          " `EQF${string}` ",
          " `EQG${string}` ",
          " `EQH${string}` ",
          " `EQI${string}` ",
          " `EQJ${string}` ",
          " `EQK${string}` ",
          " `EQL${string}` ",
          " `EQM${string}` ",
          " `EQN${string}` ",
          " `EQO${string}` ",
          " `EQP${string}` ",
          " `EQQ${string}` ",
          " `EQR${string}` ",
          " `EQS${string}` ",
          " `EQT${string}` ",
          " `EQU${string}` ",
          " `EQV${string}` ",
          " `EQW${string}` ",
          " `EQX${string}` ",
          " `EQY${string}` ",
          " `EQZ${string}` ",
          " `ERA${string}` ",
          " `ERB${string}` ",
          " `ERC${string}` ",
          " `ERD${string}` ",
          " `ERE${string}` ",
          " `ERF${string}` ",
          " `ERG${string}` ",
          " `ERH${string}` ",
          " `ERI${string}` ",
          " `ERJ${string}` ",
          " `ERK${string}` ",
          " `ERL${string}` ",
          " `ERM${string}` ",
          " `ERN${string}` ",
          " `ERO${string}` ",
          " `ERP${string}` ",
          " `ERQ${string}` ",
          " `ERR${string}` ",
          " `ERS${string}` ",
          " `ERT${string}` ",
          " `ERU${string}` ",
          " `ERV${string}` ",
          " `ERW${string}` ",
          " `ERX${string}` ",
          " `ERY${string}` ",
          " `ERZ${string}` ",
          " `ESA${string}` ",
          " `ESB${string}` ",
          " `ESC${string}` ",
          " `ESD${string}` ",
          " `ESE${string}` ",
          " `ESF${string}` ",
          " `ESG${string}` ",
          " `ESH${string}` ",
          " `ESI${string}` ",
          " `ESJ${string}` ",
          " `ESK${string}` ",
          " `ESL${string}` ",
          " `ESM${string}` ",
          " `ESN${string}` ",
          " `ESO${string}` ",
          " `ESP${string}` ",
          " `ESQ${string}` ",
          " `ESR${string}` ",
          " `ESS${string}` ",
          " `EST${string}` ",
          " `ESU${string}` ",
          " `ESV${string}` ",
          " `ESW${string}` ",
          " `ESX${string}` ",
          " `ESY${string}` ",
          " `ESZ${string}` ",
          " `ETA${string}` ",
          " `ETB${string}` ",
          " `ETC${string}` ",
          " `ETD${string}` ",
          " `ETE${string}` ",
          " `ETF${string}` ",
          " `ETG${string}` ",
          " `ETH${string}` ",
          " `ETI${string}` ",
          " `ETJ${string}` ",
          " `ETK${string}` ",
          " `ETL${string}` ",
          " `ETM${string}` ",
          " `ETN${string}` ",
          " `ETO${string}` ",
          " `ETP${string}` ",
          " `ETQ${string}` ",
          " `ETR${string}` ",
          " `ETS${string}` ",
          " `ETT${string}` ",
          " `ETU${string}` ",
          " `ETV${string}` ",
          " `ETW${string}` ",
          " `ETX${string}` ",
          " `ETY${string}` ",
          " `ETZ${string}` ",
          " `EUA${string}` ",
          " `EUB${string}` ",
          " `EUC${string}` ",
          " `EUD${string}` ",
          " `EUE${string}` ",
          " `EUF${string}` ",
          " `EUG${string}` ",
          " `EUH${string}` ",
          " `EUI${string}` ",
          " `EUJ${string}` ",
          " `EUK${string}` ",
          " `EUL${string}` ",
          " `EUM${string}` ",
          " `EUN${string}` ",
          " `EUO${string}` ",
          " `EUP${string}` ",
          " `EUQ${string}` ",
          " `EUR${string}` ",
          " `EUS${string}` ",
          " `EUT${string}` ",
          " `EUU${string}` ",
          " `EUV${string}` ",
          " `EUW${string}` ",
          " `EUX${string}` ",
          " `EUY${string}` ",
          " `EUZ${string}` ",
          " `EVA${string}` ",
          " `EVB${string}` ",
          " `EVC${string}` ",
          " `EVD${string}` ",
          " `EVE${string}` ",
          " `EVF${string}` ",
          " `EVG${string}` ",
          " `EVH${string}` ",
          " `EVI${string}` ",
          " `EVJ${string}` ",
          " `EVK${string}` ",
          " `EVL${string}` ",
          " `EVM${string}` ",
          " `EVN${string}` ",
          " `EVO${string}` ",
          " `EVP${string}` ",
          " `EVQ${string}` ",
          " `EVR${string}` ",
          " `EVS${string}` ",
          " `EVT${string}` ",
          " `EVU${string}` ",
          " `EVV${string}` ",
          " `EVW${string}` ",
          " `EVX${string}` ",
          " `EVY${string}` ",
          " `EVZ${string}` ",
          " `EWA${string}` ",
          " `EWB${string}` ",
          " `EWC${string}` ",
          " `EWD${string}` ",
          " `EWE${string}` ",
          " `EWF${string}` ",
          " `EWG${string}` ",
          " `EWH${string}` ",
          " `EWI${string}` ",
          " `EWJ${string}` ",
          " `EWK${string}` ",
          " `EWL${string}` ",
          " `EWM${string}` ",
          " `EWN${string}` ",
          " `EWO${string}` ",
          " `EWP${string}` ",
          " `EWQ${string}` ",
          " `EWR${string}` ",
          " `EWS${string}` ",
          " `EWT${string}` ",
          " `EWU${string}` ",
          " `EWV${string}` ",
          " `EWW${string}` ",
          " `EWX${string}` ",
          " `EWY${string}` ",
          " `EWZ${string}` ",
          " `EXA${string}` ",
          " `EXB${string}` ",
          " `EXC${string}` ",
          " `EXD${string}` ",
          " `EXE${string}` ",
          " `EXF${string}` ",
          " `EXG${string}` ",
          " `EXH${string}` ",
          " `EXI${string}` ",
          " `EXJ${string}` ",
          " `EXK${string}` ",
          " `EXL${string}` ",
          " `EXM${string}` ",
          " `EXN${string}` ",
          " `EXO${string}` ",
          " `EXP${string}` ",
          " `EXQ${string}` ",
          " `EXR${string}` ",
          " `EXS${string}` ",
          " `EXT${string}` ",
          " `EXU${string}` ",
          " `EXV${string}` ",
          " `EXW${string}` ",
          " `EXX${string}` ",
          " `EXY${string}` ",
          " `EXZ${string}` ",
          " `EYA${string}` ",
          " `EYB${string}` ",
          " `EYC${string}` ",
          " `EYD${string}` ",
          " `EYE${string}` ",
          " `EYF${string}` ",
          " `EYG${string}` ",
          " `EYH${string}` ",
          " `EYI${string}` ",
          " `EYJ${string}` ",
          " `EYK${string}` ",
          " `EYL${string}` ",
          " `EYM${string}` ",
          " `EYN${string}` ",
          " `EYO${string}` ",
          " `EYP${string}` ",
          " `EYQ${string}` ",
          " `EYR${string}` ",
          " `EYS${string}` ",
          " `EYT${string}` ",
          " `EYU${string}` ",
          " `EYV${string}` ",
          " `EYW${string}` ",
          " `EYX${string}` ",
          " `EYY${string}` ",
          " `EYZ${string}` ",
          " `EZA${string}` ",
          " `EZB${string}` ",
          " `EZC${string}` ",
          " `EZD${string}` ",
          " `EZE${string}` ",
          " `EZF${string}` ",
          " `EZG${string}` ",
          " `EZH${string}` ",
          " `EZI${string}` ",
          " `EZJ${string}` ",
          " `EZK${string}` ",
          " `EZL${string}` ",
          " `EZM${string}` ",
          " `EZN${string}` ",
          " `EZO${string}` ",
          " `EZP${string}` ",
          " `EZQ${string}` ",
          " `EZR${string}` ",
          " `EZS${string}` ",
          " `EZT${string}` ",
          " `EZU${string}` ",
          " `EZV${string}` ",
          " `EZW${string}` ",
          " `EZX${string}` ",
          " `EZY${string}` ",
          " `EZZ${string}`"
        ]
      }
    },
    subElements: {
      text: {
        required: false,
        array: false
      },
      private: {
        required: false,
        array: true
      },
      lNode: {
        required: false,
        array: true
      },
      eqFunction: {
        required: false,
        array: true
      }
    }
  },
  subEquipment: {
    tag: "SubEquipment",
    anyAllowed: {
      attributes: true,
      subElements: false
    },
    attributes: {
      desc: {
        required: false,
        types: [
          "string ",
          " undefined"
        ]
      },
      name: {
        required: true,
        types: [
          "string"
        ]
      },
      phase: {
        required: false,
        types: [
          "\"A\" ",
          " \"B\" ",
          " \"C\" ",
          " \"N\" ",
          " \"all\" ",
          " \"none\" ",
          " \"AB\" ",
          " \"BC\" ",
          " \"CA\" ",
          " undefined"
        ]
      },
      virtual: {
        required: false,
        types: [
          "\"false\" ",
          " \"true\" ",
          " undefined"
        ]
      }
    },
    subElements: {
      text: {
        required: false,
        array: false
      },
      private: {
        required: false,
        array: true
      },
      lNode: {
        required: false,
        array: true
      },
      eqFunction: {
        required: false,
        array: true
      }
    }
  },
  conductingEquipment: {
    tag: "ConductingEquipment",
    anyAllowed: {
      attributes: true,
      subElements: false
    },
    attributes: {
      desc: {
        required: false,
        types: [
          "string ",
          " undefined"
        ]
      },
      name: {
        required: true,
        types: [
          "string"
        ]
      },
      virtual: {
        required: false,
        types: [
          "\"false\" ",
          " \"true\" ",
          " undefined"
        ]
      },
      type: {
        required: true,
        types: [
          "\"BAT\" ",
          " \"MOT\" ",
          " \"FAN\" ",
          " \"PMP\" ",
          " \"CBR\" ",
          " \"DIS\" ",
          " \"VTR\" ",
          " \"CTR\" ",
          " \"GEN\" ",
          " \"CAP\" ",
          " \"REA\" ",
          " \"CON\" ",
          " \"PSH\" ",
          " \"BSH\" ",
          " \"CAB\" ",
          " \"GIL\" ",
          " \"LIN\" ",
          " \"RES\" ",
          " \"RRC\" ",
          " \"SAR\" ",
          " \"TCF\" ",
          " \"TCR\" ",
          " \"IFL\" ",
          " \"SCR\" ",
          " \"SMC\" ",
          " `EA${string}` ",
          " `EB${string}` ",
          " `EC${string}` ",
          " `ED${string}` ",
          " `EE${string}` ",
          " `EF${string}` ",
          " `EG${string}` ",
          " `EH${string}` ",
          " `EI${string}` ",
          " `EJ${string}` ",
          " `EK${string}` ",
          " `EL${string}` ",
          " `EM${string}` ",
          " `EN${string}` ",
          " `EO${string}` ",
          " `EP${string}` ",
          " `EQ${string}` ",
          " `ER${string}` ",
          " `ES${string}` ",
          " `ET${string}` ",
          " `EU${string}` ",
          " `EV${string}` ",
          " `EW${string}` ",
          " `EX${string}` ",
          " `EY${string}` ",
          " `EZ${string}`"
        ]
      }
    },
    subElements: {
      text: {
        required: false,
        array: false
      },
      private: {
        required: false,
        array: true
      },
      lNode: {
        required: false,
        array: true
      },
      terminal: {
        required: false,
        array: false
      },
      subEquipment: {
        required: false,
        array: true
      },
      eqFunction: {
        required: false,
        array: true
      }
    }
  },
  powerTransformer: {
    tag: "PowerTransformer",
    anyAllowed: {
      attributes: true,
      subElements: false
    },
    attributes: {
      desc: {
        required: false,
        types: [
          "string ",
          " undefined"
        ]
      },
      name: {
        required: true,
        types: [
          "\"PTR\""
        ]
      },
      virtual: {
        required: false,
        types: [
          "\"false\" ",
          " \"true\" ",
          " undefined"
        ]
      }
    },
    subElements: {
      text: {
        required: false,
        array: false
      },
      private: {
        required: false,
        array: true
      },
      lNode: {
        required: false,
        array: true
      },
      transformerWinding: {
        required: false,
        array: true
      },
      subEquipment: {
        required: false,
        array: true
      },
      eqFunction: {
        required: false,
        array: true
      }
    }
  },
  transformerWinding: {
    tag: "TransformerWinding",
    anyAllowed: {
      attributes: true,
      subElements: false
    },
    attributes: {
      desc: {
        required: false,
        types: [
          "string ",
          " undefined"
        ]
      },
      name: {
        required: true,
        types: [
          "\"PTW\""
        ]
      },
      virtual: {
        required: false,
        types: [
          "\"false\" ",
          " \"true\" ",
          " undefined"
        ]
      }
    },
    subElements: {
      text: {
        required: false,
        array: false
      },
      private: {
        required: false,
        array: true
      },
      lNode: {
        required: false,
        array: true
      },
      terminal: {
        required: false,
        array: false
      },
      subEquipment: {
        required: false,
        array: true
      },
      tapChanger: {
        required: false,
        array: false
      },
      neutralPoint: {
        required: false,
        array: false
      },
      eqFunction: {
        required: false,
        array: true
      }
    }
  },
  tapChanger: {
    tag: "TapChanger",
    anyAllowed: {
      attributes: true,
      subElements: false
    },
    attributes: {
      desc: {
        required: false,
        types: [
          "string ",
          " undefined"
        ]
      },
      name: {
        required: true,
        types: [
          "\"LTC\""
        ]
      },
      virtual: {
        required: false,
        types: [
          "\"false\" ",
          " \"true\" ",
          " undefined"
        ]
      }
    },
    subElements: {
      text: {
        required: false,
        array: false
      },
      private: {
        required: false,
        array: true
      },
      lNode: {
        required: false,
        array: true
      },
      subEquipment: {
        required: false,
        array: true
      },
      eqFunction: {
        required: false,
        array: true
      }
    }
  },
  terminal: {
    tag: "Terminal",
    anyAllowed: {
      attributes: true,
      subElements: false
    },
    attributes: {
      desc: {
        required: false,
        types: [
          "string ",
          " undefined"
        ]
      },
      name: {
        required: false,
        types: [
          "string ",
          " undefined"
        ]
      },
      connectivityNode: {
        required: true,
        types: [
          "string"
        ]
      },
      processName: {
        required: false,
        types: [
          "string ",
          " undefined"
        ]
      },
      substationName: {
        required: false,
        types: [
          "string ",
          " undefined"
        ]
      },
      voltageLevelName: {
        required: false,
        types: [
          "string ",
          " undefined"
        ]
      },
      bayName: {
        required: false,
        types: [
          "string ",
          " undefined"
        ]
      },
      cNodeName: {
        required: true,
        types: [
          "string"
        ]
      },
      lineName: {
        required: false,
        types: [
          "string ",
          " undefined"
        ]
      }
    },
    subElements: {
      text: {
        required: false,
        array: false
      },
      private: {
        required: false,
        array: true
      }
    }
  },
  eqFunction: {
    tag: "EqFunction",
    anyAllowed: {
      attributes: true,
      subElements: false
    },
    attributes: {
      desc: {
        required: false,
        types: [
          "string ",
          " undefined"
        ]
      },
      name: {
        required: true,
        types: [
          "string"
        ]
      },
      type: {
        required: false,
        types: [
          "string ",
          " undefined"
        ]
      }
    },
    subElements: {
      text: {
        required: false,
        array: false
      },
      private: {
        required: false,
        array: true
      },
      lNode: {
        required: false,
        array: true
      },
      generalEquipment: {
        required: false,
        array: true
      },
      eqSubFunction: {
        required: false,
        array: true
      }
    }
  },
  eqSubFunction: {
    tag: "EqSubFunction",
    anyAllowed: {
      attributes: true,
      subElements: false
    },
    attributes: {
      desc: {
        required: false,
        types: [
          "string ",
          " undefined"
        ]
      },
      name: {
        required: true,
        types: [
          "string"
        ]
      },
      type: {
        required: false,
        types: [
          "string ",
          " undefined"
        ]
      }
    },
    subElements: {
      text: {
        required: false,
        array: false
      },
      private: {
        required: false,
        array: true
      },
      lNode: {
        required: false,
        array: true
      },
      generalEquipment: {
        required: false,
        array: true
      },
      eqSubFunction: {
        required: false,
        array: true
      }
    }
  },
  substation: {
    tag: "Substation",
    anyAllowed: {
      attributes: false,
      subElements: false
    },
    attributes: {},
    subElements: {
      voltageLevel: {
        required: false,
        array: true
      },
      function: {
        required: false,
        array: true
      }
    }
  },
  voltageLevel: {
    tag: "VoltageLevel",
    anyAllowed: {
      attributes: true,
      subElements: false
    },
    attributes: {
      desc: {
        required: false,
        types: [
          "string ",
          " undefined"
        ]
      },
      name: {
        required: true,
        types: [
          "string"
        ]
      },
      nomFreq: {
        required: false,
        types: [
          "`${number}` ",
          " undefined"
        ]
      },
      numPhases: {
        required: false,
        types: [
          "\"4\" ",
          " \"0\" ",
          " \"2\" ",
          " \"1\" ",
          " \"3\" ",
          " \"5\" ",
          " \"6\" ",
          " \"7\" ",
          " \"8\" ",
          " \"9\" ",
          " \"10\" ",
          " \"11\" ",
          " \"12\" ",
          " \"13\" ",
          " \"14\" ",
          " \"15\" ",
          " \"16\" ",
          " \"17\" ",
          " \"18\" ",
          " \"19\" ",
          " \"20\" ",
          " \"21\" ",
          " \"22\" ",
          " \"23\" ",
          " \"24\" ",
          " \"25\" ",
          " \"26\" ",
          " \"27\" ",
          " \"28\" ",
          " \"29\" ",
          " \"30\" ",
          " \"31\" ",
          " \"32\" ",
          " \"33\" ",
          " \"34\" ",
          " \"35\" ",
          " \"36\" ",
          " \"37\" ",
          " \"38\" ",
          " \"39\" ",
          " \"40\" ",
          " \"41\" ",
          " \"42\" ",
          " \"43\" ",
          " \"44\" ",
          " \"45\" ",
          " \"46\" ",
          " \"47\" ",
          " \"48\" ",
          " \"49\" ",
          " \"50\" ",
          " \"51\" ",
          " \"52\" ",
          " \"53\" ",
          " \"54\" ",
          " \"55\" ",
          " \"56\" ",
          " \"57\" ",
          " \"58\" ",
          " \"59\" ",
          " \"60\" ",
          " \"61\" ",
          " \"62\" ",
          " \"63\" ",
          " \"64\" ",
          " \"65\" ",
          " \"66\" ",
          " \"67\" ",
          " \"68\" ",
          " \"69\" ",
          " \"70\" ",
          " \"71\" ",
          " \"72\" ",
          " \"73\" ",
          " \"74\" ",
          " \"75\" ",
          " \"76\" ",
          " \"77\" ",
          " \"78\" ",
          " \"79\" ",
          " \"80\" ",
          " \"81\" ",
          " \"82\" ",
          " \"83\" ",
          " \"84\" ",
          " \"85\" ",
          " \"86\" ",
          " \"87\" ",
          " \"88\" ",
          " \"89\" ",
          " \"90\" ",
          " \"91\" ",
          " \"92\" ",
          " \"93\" ",
          " \"94\" ",
          " \"95\" ",
          " \"96\" ",
          " \"97\" ",
          " \"98\" ",
          " \"99\" ",
          " \"100\" ",
          " \"101\" ",
          " \"102\" ",
          " \"103\" ",
          " \"104\" ",
          " \"105\" ",
          " \"106\" ",
          " \"107\" ",
          " \"108\" ",
          " \"109\" ",
          " \"110\" ",
          " \"111\" ",
          " \"112\" ",
          " \"113\" ",
          " \"114\" ",
          " \"115\" ",
          " \"116\" ",
          " \"117\" ",
          " \"118\" ",
          " \"119\" ",
          " \"120\" ",
          " \"121\" ",
          " \"122\" ",
          " \"123\" ",
          " \"124\" ",
          " \"125\" ",
          " \"126\" ",
          " \"127\" ",
          " \"128\" ",
          " \"129\" ",
          " \"130\" ",
          " \"131\" ",
          " \"132\" ",
          " \"133\" ",
          " \"134\" ",
          " \"135\" ",
          " \"136\" ",
          " \"137\" ",
          " \"138\" ",
          " \"139\" ",
          " \"140\" ",
          " \"141\" ",
          " \"142\" ",
          " \"143\" ",
          " \"144\" ",
          " \"145\" ",
          " \"146\" ",
          " \"147\" ",
          " \"148\" ",
          " \"149\" ",
          " \"150\" ",
          " \"151\" ",
          " \"152\" ",
          " \"153\" ",
          " \"154\" ",
          " \"155\" ",
          " \"156\" ",
          " \"157\" ",
          " \"158\" ",
          " \"159\" ",
          " \"160\" ",
          " \"161\" ",
          " \"162\" ",
          " \"163\" ",
          " \"164\" ",
          " \"165\" ",
          " \"166\" ",
          " \"167\" ",
          " \"168\" ",
          " \"169\" ",
          " \"170\" ",
          " \"171\" ",
          " \"172\" ",
          " \"173\" ",
          " \"174\" ",
          " \"175\" ",
          " \"176\" ",
          " \"177\" ",
          " \"178\" ",
          " \"179\" ",
          " \"180\" ",
          " \"181\" ",
          " \"182\" ",
          " \"183\" ",
          " \"184\" ",
          " \"185\" ",
          " \"186\" ",
          " \"187\" ",
          " \"188\" ",
          " \"189\" ",
          " \"190\" ",
          " \"191\" ",
          " \"192\" ",
          " \"193\" ",
          " \"194\" ",
          " \"195\" ",
          " \"196\" ",
          " \"197\" ",
          " \"198\" ",
          " \"199\" ",
          " \"200\" ",
          " \"201\" ",
          " \"202\" ",
          " \"203\" ",
          " \"204\" ",
          " \"205\" ",
          " \"206\" ",
          " \"207\" ",
          " \"208\" ",
          " \"209\" ",
          " \"210\" ",
          " \"211\" ",
          " \"212\" ",
          " \"213\" ",
          " \"214\" ",
          " \"215\" ",
          " \"216\" ",
          " \"217\" ",
          " \"218\" ",
          " \"219\" ",
          " \"220\" ",
          " \"221\" ",
          " \"222\" ",
          " \"223\" ",
          " \"224\" ",
          " \"225\" ",
          " \"226\" ",
          " \"227\" ",
          " \"228\" ",
          " \"229\" ",
          " \"230\" ",
          " \"231\" ",
          " \"232\" ",
          " \"233\" ",
          " \"234\" ",
          " \"235\" ",
          " \"236\" ",
          " \"237\" ",
          " \"238\" ",
          " \"239\" ",
          " \"240\" ",
          " \"241\" ",
          " \"242\" ",
          " \"243\" ",
          " \"244\" ",
          " \"245\" ",
          " \"246\" ",
          " \"247\" ",
          " \"248\" ",
          " \"249\" ",
          " \"250\" ",
          " \"251\" ",
          " \"252\" ",
          " \"253\" ",
          " \"254\" ",
          " \"255\" ",
          " undefined"
        ]
      }
    },
    subElements: {
      text: {
        required: false,
        array: false
      },
      private: {
        required: false,
        array: true
      },
      lNode: {
        required: false,
        array: true
      },
      powerTransformer: {
        required: false,
        array: true
      },
      generalEquipment: {
        required: false,
        array: true
      },
      voltage: {
        required: false,
        array: false
      },
      bay: {
        required: false,
        array: true
      },
      function: {
        required: false,
        array: true
      }
    }
  },
  function: {
    tag: "Function",
    anyAllowed: {
      attributes: true,
      subElements: false
    },
    attributes: {
      desc: {
        required: false,
        types: [
          "string ",
          " undefined"
        ]
      },
      name: {
        required: true,
        types: [
          "string"
        ]
      },
      type: {
        required: false,
        types: [
          "string ",
          " undefined"
        ]
      }
    },
    subElements: {
      text: {
        required: false,
        array: false
      },
      private: {
        required: false,
        array: true
      },
      lNode: {
        required: false,
        array: true
      },
      subFunction: {
        required: false,
        array: true
      },
      generalEquipment: {
        required: false,
        array: true
      },
      conductingEquipment: {
        required: false,
        array: true
      }
    }
  },
  subFunction: {
    tag: "SubFunction",
    anyAllowed: {
      attributes: true,
      subElements: false
    },
    attributes: {
      desc: {
        required: false,
        types: [
          "string ",
          " undefined"
        ]
      },
      name: {
        required: true,
        types: [
          "string"
        ]
      },
      type: {
        required: false,
        types: [
          "string ",
          " undefined"
        ]
      }
    },
    subElements: {
      text: {
        required: false,
        array: false
      },
      private: {
        required: false,
        array: true
      },
      lNode: {
        required: false,
        array: true
      },
      subFunction: {
        required: false,
        array: true
      },
      generalEquipment: {
        required: false,
        array: true
      },
      conductingEquipment: {
        required: false,
        array: true
      }
    }
  },
  voltage: {
    tag: "Voltage",
    anyAllowed: {
      attributes: true,
      subElements: false
    },
    attributes: {
      desc: {
        required: false,
        types: [
          "string ",
          " undefined"
        ]
      },
      unit: {
        required: true,
        types: [
          "\"V\""
        ]
      },
      multiplier: {
        required: false,
        types: [
          "\"\" ",
          " \"E\" ",
          " \"G\" ",
          " \"M\" ",
          " \"P\" ",
          " \"T\" ",
          " \"Y\" ",
          " \"Z\" ",
          " \"m\" ",
          " \"k\" ",
          " \"mu\" ",
          " \"y\" ",
          " \"z\" ",
          " \"a\" ",
          " \"f\" ",
          " \"p\" ",
          " \"n\" ",
          " \"c\" ",
          " \"d\" ",
          " \"da\" ",
          " \"h\" ",
          " undefined"
        ]
      }
    },
    subElements: {
      text: {
        required: false,
        array: false
      },
      private: {
        required: false,
        array: true
      }
    }
  },
  bay: {
    tag: "Bay",
    anyAllowed: {
      attributes: true,
      subElements: false
    },
    attributes: {
      desc: {
        required: false,
        types: [
          "string ",
          " undefined"
        ]
      },
      name: {
        required: true,
        types: [
          "string"
        ]
      }
    },
    subElements: {
      text: {
        required: false,
        array: false
      },
      private: {
        required: false,
        array: true
      },
      lNode: {
        required: false,
        array: true
      },
      powerTransformer: {
        required: false,
        array: true
      },
      generalEquipment: {
        required: false,
        array: true
      },
      conductingEquipment: {
        required: false,
        array: true
      },
      connectivityNode: {
        required: false,
        array: true
      },
      function: {
        required: false,
        array: true
      }
    }
  },
  connectivityNode: {
    tag: "ConnectivityNode",
    anyAllowed: {
      attributes: true,
      subElements: false
    },
    attributes: {
      desc: {
        required: false,
        types: [
          "string ",
          " undefined"
        ]
      },
      name: {
        required: true,
        types: [
          "string"
        ]
      },
      pathName: {
        required: true,
        types: [
          "string"
        ]
      }
    },
    subElements: {
      text: {
        required: false,
        array: false
      },
      private: {
        required: false,
        array: true
      },
      lNode: {
        required: false,
        array: true
      }
    }
  },
  lNode: {
    tag: "LNode",
    anyAllowed: {
      attributes: false,
      subElements: false
    },
    attributes: {
      iedName: {
        required: false,
        types: [
          "string ",
          " undefined"
        ]
      },
      ldInst: {
        required: false,
        types: [
          "string ",
          " undefined"
        ]
      },
      prefix: {
        required: false,
        types: [
          "string ",
          " undefined"
        ]
      },
      lnClass: {
        required: true,
        types: [
          "import(\"/Users/m.guerin/Documents/TransnetBW/openscd/plugins/packages/core/standard/src/ed2/definition/shared/types.lnClass\").LNClass.SystemGroup ",
          " import(\"/Users/m.guerin/Documents/TransnetBW/openscd/plugins/packages/core/standard/src/ed2/definition/shared/types.lnClass\").LNClass.DomainGroupA ",
          " import(\"/Users/m.guerin/Documents/TransnetBW/openscd/plugins/packages/core/standard/src/ed2/definition/shared/types.lnClass\").LNClass.DomainGroupC ",
          " import(\"/Users/m.guerin/Documents/TransnetBW/openscd/plugins/packages/core/standard/src/ed2/definition/shared/types.lnClass\").LNClass.DomainGroupF ",
          " import(\"/Users/m.guerin/Documents/TransnetBW/openscd/plugins/packages/core/standard/src/ed2/definition/shared/types.lnClass\").LNClass.DomainGroupG ",
          " import(\"/Users/m.guerin/Documents/TransnetBW/openscd/plugins/packages/core/standard/src/ed2/definition/shared/types.lnClass\").LNClass.DomainGroupI ",
          " import(\"/Users/m.guerin/Documents/TransnetBW/openscd/plugins/packages/core/standard/src/ed2/definition/shared/types.lnClass\").LNClass.DomainGroupK ",
          " import(\"/Users/m.guerin/Documents/TransnetBW/openscd/plugins/packages/core/standard/src/ed2/definition/shared/types.lnClass\").LNClass.DomainGroupM ",
          " import(\"/Users/m.guerin/Documents/TransnetBW/openscd/plugins/packages/core/standard/src/ed2/definition/shared/types.lnClass\").LNClass.DomainGroupP ",
          " import(\"/Users/m.guerin/Documents/TransnetBW/openscd/plugins/packages/core/standard/src/ed2/definition/shared/types.lnClass\").LNClass.DomainGroupQ ",
          " import(\"/Users/m.guerin/Documents/TransnetBW/openscd/plugins/packages/core/standard/src/ed2/definition/shared/types.lnClass\").LNClass.DomainGroupR ",
          " import(\"/Users/m.guerin/Documents/TransnetBW/openscd/plugins/packages/core/standard/src/ed2/definition/shared/types.lnClass\").LNClass.DomainGroupS ",
          " import(\"/Users/m.guerin/Documents/TransnetBW/openscd/plugins/packages/core/standard/src/ed2/definition/shared/types.lnClass\").LNClass.DomainGroupT ",
          " import(\"/Users/m.guerin/Documents/TransnetBW/openscd/plugins/packages/core/standard/src/ed2/definition/shared/types.lnClass\").LNClass.DomainGroupX ",
          " import(\"/Users/m.guerin/Documents/TransnetBW/openscd/plugins/packages/core/standard/src/ed2/definition/shared/types.lnClass\").LNClass.DomainGroupY ",
          " import(\"/Users/m.guerin/Documents/TransnetBW/openscd/plugins/packages/core/standard/src/ed2/definition/shared/types.lnClass\").LNClass.DomainGroupZ"
        ]
      },
      lnInst: {
        required: false,
        types: [
          "string ",
          " undefined"
        ]
      },
      lnType: {
        required: false,
        types: [
          "string ",
          " undefined"
        ]
      }
    },
    subElements: {}
  }
} as const;

export default generated;