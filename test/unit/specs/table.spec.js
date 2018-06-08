import {
  getTableItems,
  getHead,
  getBody,
  getTable,
  getRows
} from "../tools/util";
import { mount } from "@vue/test-utils";
import { data, titles, http } from "../tools/source";
import flushPromises from "flush-Promises";

describe("client render table", () => {
  let baseVm, noDataVm, propVm, slotVm, emptySlotVm, layoutVm;

  // base table render
  baseVm = mount({
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
      };
    }
  });
  it("base table render", () => {
    let { table, head, body, rows } = getTableItems(baseVm);
    expect(rows.length).toEqual(3);
    let firstRow = rows.at(0);
    let firstItemTds = firstRow.findAll("td").at(0);
    let secondItemTds = firstRow.findAll("td").at(1);
    let thirdItemTds = firstRow.findAll("td").at(2);
    firstItemTds.text().should.equal("FW201601010001");
    secondItemTds.text().should.equal("Water flood");
    thirdItemTds.text().should.equal("Repair");
    table.contains(".el-table__header-wrapper").should.equal(true);
    expect(head.findAll("th").length).toBe(3);
    baseVm.destroy();
  });
  // no data render
  noDataVm = mount({
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
      };
    }
  });

  it("no data", () => {
    let { rows } = getTableItems(noDataVm);
    rows.length.should.equal(0);
    noDataVm.destroy();
  });
  // table props render
  propVm = mount({
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
            prop: "flow_no",
            order: "descending"
          }
        }
      };
    },
    methods: {
      itemClick() {
        rowClickCnt++;
      }
    }
  });
  it("table props", () => {
    let { table, head } = getTableItems(propVm);
    table.contains(".el-table--border").should.equal(true);
    table.contains(".el-table--striped").should.equal(true);
    head
      .findAll("th")
      .at(0)
      .contains(".descending")
      .should.equal(true);
    propVm.destroy();
  });
  // slot render
  slotVm = mount({
    template: `
      <data-tables :data="data">
        <el-table-column v-for="title in titles" :prop="title.prop" :label="title.label" :key="title.label" sortable="custom">
        </el-table-column>
        <p slot="append">table slot</p>
      </data-tables>
  `,
    data() {
      return {
        data,
        titles
      };
    }
  });
  it("slot render", () => {
    let { table } = getTableItems(slotVm);
    table
      .find("p")
      .text()
      .should.equal("table slot");
    slotVm.destroy();
  });
  // empty slot render
  emptySlotVm = mount({
    template: `
      <data-tables :data=[]>
        <el-table-column v-for="title in titles" :prop="title.prop" :label="title.label" :key="title.label" sortable="custom">
        </el-table-column>
        <p slot="empty">table slot</p>
      </data-tables>
    `,
    data() {
      return {
        data,
        titles
      };
    }
  });
  it("empty slot render", () => {
    let { rows, table } = getTableItems(emptySlotVm);
    rows.length.should.equal(0);
    table
      .find("p")
      .text()
      .should.equal("table slot");
    emptySlotVm.destroy();
  });
  // layout render
  layoutVm = mount({
    template: `
      <data-tables :data="data" :pagination-props="paginationDef" layout="pagination, table">
        <el-table-column v-for="title in titles" :prop="title.prop" :label="title.label" :key="title.label">
        </el-table-column>
      </data-tables>
    `,
    data() {
      return {
        data,
        titles,
        paginationDef: {
          pageSize: 1,
          pageSizes: [10, 20, 30],
          currentPage: 1
        }
      };
    }
  });
  it("layout render", () => {
    layoutVm.contains(".el-pagination").should.equal(true);
    layoutVm.contains(".el-table").should.equal(true);
    let pageIndex = layoutVm.html().indexOf("el-pagination");
    let tableIndex = layoutVm.html().indexOf("el-table");
    tableIndex.should.above(pageIndex);
  });
});

describe("Server render table", () => {
  let serverVm;
  // beforeEach(() => {
  //   jest.useFakeTimers();
  // });
  serverVm = mount({
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
      return { data, titles, total: 0 };
    },
    methods: {
      async loadData(queryInfo) {
        // http.mockImplementation(queryInfo);
        let { data, total } = await http(queryInfo);
        this.data = data;
        this.total = total;
      }
    }
  });
  it("should render correct content", async() => {
    let { table, head, rows } = getTableItems(serverVm);
    console.log(rows.length);
    // let secondItem = rows.at(1);
    // let secondItemTds = secondItem.findAll("td");
    // secondItemTds
    //   .at(0)
    //   .text()
    //   .should.equal("FW201601010001");
    // rows.at(19)
    //   .findAll("td").at(0)
    //   .text().should.contains("FW2016010100019");
    // should.not.exist(head.findAll("td.ascending"));
    // table.should.have.class("el-table--border");
    // table.should.have.class("el-table--striped");
    serverVm.destory;
  });
});
