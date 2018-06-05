
export let DELAY = 100

export let emptyData = []

export let tableData = [{
  'building': '5',
  'building_group': 'North',
  'cellphone': '13400000000',
  'content': 'Water flood',
  'create_time': '2016-10-01 22:25',
  'flow_no': 'FW201601010001',
  'flow_type': 'Repair',
  'flow_type_code': 'repair',
  'id': '111111',
  'room_id': '00501',
  'room_no': '501',
  'state': 'Created',
  'state_code': 'created'
}, {
  'building': '6',
  'building_group': 'Sourth',
  'cellphone': '13400000000',
  'content': 'Lock broken',
  'create_time': '2016-10-01 22:25',
  'flow_no': 'FW201601010002',
  'flow_type': 'Repair',
  'flow_type_code': 'repair',
  'id': '2222222',
  'room_id': '00701',
  'room_no': '701',
  'state': 'Assigned',
  'state_code': 'assigned'
}, {
  'building': '9',
  'building_group': 'North',
  'cellphone': '13400000000',
  'content': 'Help to buy some drinks',
  'create_time': '2016-10-02 22:25',
  'flow_no': 'FW201601010003',
  'flow_type': 'Help',
  'flow_type_code': 'help',
  'id': '2222222',
  'room_id': '00601',
  'room_no': '601',
  'state': 'Closed',
  'state_code': 'closed'
}]

export
let titles = [{
  prop: 'flow_no',
  label: 'No.'
}, {
  prop: 'content',
  label: 'Content'
}, {
  prop: 'create_time',
  label: 'Time',
}, {
  prop: 'state',
  label: 'State'
}, {
  prop: 'flow_type',
  label: 'Type'
}, {
  prop: 'building_group',
  label: 'building group'
}, {
  prop: 'building',
  label: 'building'
}, {
  prop: 'room_no',
  label: 'no'
}, {
  prop: 'cellphone',
  label: 'tel'
}]

let serverData = []

for (let i = 0; i < 1000; i++) {
  serverData.push({
    'content': 'Lock broken' + i,
    'flow_no': 'FW20160101000' + i,
    'flow_type': i % 2 === 0 ? 'Repair' : 'Help',
    'flow_type_code': i % 2 === 0 ? 'repair' : 'help',
  })
}

/*
page: this.currentPage,
pageSize: this.innerPageSize,
sortInfo: this.sortData,
filters: this.filters
*/

export let mockServer = function (res) {
  let datas = serverData.slice()
  let allKeys = Object.keys(data[0])

  // do filter
  res && res.filters && res.filters.forEach(filter => {
    datas = datas.filter(data => {
      let props = (filter.search_prop && [].concat(filter.search_prop)) || allKeys
      return props.some(prop => {
        if (!filter.value || filter.value.length === 0) {
          return true
        }
        return [].concat(filter.value).some(val => {
          return data[prop].toString().toLowerCase().indexOf(val.toLowerCase()) > -1
        })
      })
    })
  })

  // do sort
  if (res.sort && res.sort.order) {
    let order = res.sort.order
    let prop = res.sort.prop
    let isDescending = order === 'descending'

    datas.sort(function (a, b) {
      if (a[prop] > b[prop]) {
        return 1
      } else if (a[prop] < b[prop]) {
        return -1
      } else {
        return 0
      }
    })
    if (isDescending) {
      datas.reverse()
    }
  }

  return {
    data: datas.slice((res.page - 1) * res.pageSize, res.page * res.pageSize),
    req: res,
    ts: new Date(),
    total: datas.length
  }
}

export let http = function(res, time = 200) {
  console.log('http')
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      var data = mockServer(res)
      console.log('fake server return data: ', data)
      resolve(data)
    }, time)
  })
}

export let mockServerError = function(res, time = 200) {
  return new Promise((resolve, reject) => {
    setTimeout(_ => {
      reject(new Error('network error'))
    }, time)
  })
}
