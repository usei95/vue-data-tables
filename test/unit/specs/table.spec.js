import {createVue, destroyVM, getTableItems, getHead, getBody, getTable, getRows} from '../tools/util'
import { mount } from '@vue/test-utils'
import { DELAY, data, titles, http, emptyData} from '../tools/source'
import Vue from 'vue'

describe('client render table', () => {
  let baseVm, noDataVm, propVm

  baseVm = createVue({
    template: `
                <data-tables :data="data">
                <el-table-column v-for="title in titles"
                    :prop="title.prop"
                    :label="title.label"
                    :key="title.prop" sortable="custom"/>
                </data-tables>
            `,
    data() {
      return {
        data,
        titles
      }
    },
  })
  // });
  noDataVm = createVue({
    template: `
        <data-tables>
          <el-table-column v-for="title in titles"
            :prop="title.prop"
            :label="title.label"
            :key="title.prop" sortable="custom"/>
        </data-tables>
      `,
    data() {
      return {
        titles
      }
    },
  })

  propVm = createVue({
    template: `
        <data-tables :data="data" :tableProps='tableProps'>
          <el-table-column v-for="title in titles"
            :prop="title.prop"
            :label="title.label"
            :key="title.prop" sortable="custom"/>
        </data-tables>
      `,
    data() {
      return {
        data,
        titles,
        tableProps: {
          border: true,
          stripe: true,
          defaultSort: {
            prop: 'flow_no',
            order: 'descending'
          }
        }
      }
    },
    methods: {
      itemClick() {
        rowClickCnt++
      }
    }
  })


  it('table compelete', () => {
    let {table, head, body, rows} = getTableItems(baseVm);
    expect(rows.length).toEqual(3)
    let firstRow = rows.at(0)
    let firstItemTds = firstRow.findAll('td').at(0)
    let secondItemTds = firstRow.findAll('td').at(1)
    let thirdItemTds = firstRow.findAll('td').at(2)
    firstItemTds.text().should.equal('FW201601010001')
    secondItemTds.text().should.equal('Water flood')
    thirdItemTds.text().should.equal('Repair')
    table.contains('.el-table__header-wrapper').should.equal(true)
    expect(head.findAll('th').length).toBe(3)
    baseVm.destroy()
  })

  it('no data', () => {
    let {rows} = getTableItems(noDataVm);
    rows.length.should.equal(0)
    noDataVm.destroy()
  })

  it('table props', () => {
    let {table, head} = getTableItems(propVm);
    table.contains('.el-table--border').should.equal(true)
    table.contains('.el-table--striped').should.equal(true)
    head.findAll('th').at(0).contains('.descending').should.equal(true)
    propVm.destroy()
  })
})

describe.only('Server render table', () => {
  let vm = mount({
    template: `
      <data-tables-server
        ref='server' 
        :data="data" 
        :total="total" 
        @query-change="loadData"
      >
        <el-table-column v-for="title in titles" 
          :prop="title.prop" 
          :label="title.label" 
          :key="title.label"> 
        </el-table-column>
      </data-tables-server>
      `,
    data() {
      return {
        data: [],
        titles,
        total: 0
      }
    },
    methods: {
      async loadData(queryInfo) {
        let { data, total } = await http(queryInfo)
        this.data = data
        this.total = total
      }
    }
  },)
  it('should render correct content', () => {
    // let {table, head, rows} = getTableItems(serverBaseVm)
    // console.log(rows.length)
    // let secondItem = rows.at(1)
    // console.log(table.html())
    // let secondItemTds = secondItem.findAll('td')
    // secondItemTds.at(0).text().should.equal('FW201601010001')
    // rows[19].querySelectorAll('td')[0].innerText.should.contains('FW2016010100019')
    // should.not.exist(head.querySelector('td.ascending'))
    // table.should.have.class('el-table--border')
    // table.should.have.class('el-table--striped')
    // serverBaseVm.destory
  })
})
