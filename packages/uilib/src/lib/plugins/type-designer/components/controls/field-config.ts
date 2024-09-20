export const fieldConfig = {
    CreateBayEvent: [
      { name: 'id', label: 'ID', type: 'text' },
      { name: 'name', label: 'Name', type: 'text' },
      { name: 'desc', label: 'Description', type: 'text' },
    ],
    CreateSubstationEvent: [
      { name: 'id', label: 'ID', type: 'text' },
      { name: 'name', label: 'Name', type: 'text' },
      { name: 'desc', label: 'Description', type: 'text' },
    ],
    CreateLDeviceEvent: [
      { name: 'id', label: 'ID', type: 'text' },
      { name: 'desc', label: 'Description', type: 'text' },
      { name: 'inst', label: 'Instance', type: 'text' },
    ],
    CreateIEDEvent: [
      { name: 'id', label: 'ID', type: 'text' },
      { name: 'name', label: 'Name', type: 'text' },
      { name: 'desc', label: 'Description', type: 'text' },
      { name: 'manufacturer', label: 'Manufacturer', type: 'text' },
      { name: 'type', label: 'Type', type: 'text' },
      { name: 'originalSclRevision', label: 'SclRevision', type: 'text' },
      { name: 'originalSclVersion', label: 'SclVersion', type: 'text' },
      { name: 'owner', label: 'Owner', type: 'text' },
    ],
    CreateVoltageLevelEvent: [
      { name: 'id', label: 'ID', type: 'text' },
      { name: 'name', label: 'Name', type: 'text' },
      { name: 'desc', label: 'Description', type: 'text' },
      { name: 'nomFreq', label: 'Nominal Frequency', type: 'text' },
      { name: 'numPhases', label: 'Number of Phases', type: 'text' },
    ],
  };