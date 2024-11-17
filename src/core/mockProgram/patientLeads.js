const implantInfo = {
  brainSide: '',
  implantNucleus: [],
  leadType: '',
  extendWire: '',
  channel: '',
}

const programInfo = {
  programIndex: '',
  programName: '',
  amplitude: '',
  width: '',
  rate: '',
  display: '',
  stimMode: '',
  nodeList: [0, 1, 2, 0],
}

const chipInfo = {
  stimInfo: {
    number: '',
    status: '',
    color: '',
  },
  sceneInfo: {
    mesh: '',
  },
}

const vtaInfo = []

const patientLeads = {
  ipgSN: '1010P12313',
  leads: [
    {
      position: '',
      implantInfo: implantInfo,
      stimProgramList: [programInfo],
      vtaList: [vtaInfo],
      chipList: [chipInfo],
      sceneInfo: {
        mesh: '',
      },
    },
  ],
}
