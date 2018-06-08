import {
  getTableItems,
  getHead,
  getBody,
  getTable,
  getRows,
  sleep
} from "../tools/util";
import { mount } from "@vue/test-utils";
import { data, titles, http } from "../tools/source";
import sinon from "sinon";
describe("client actionColDef", () => {
  let baseVm;
  let spy1 = sinon.spy();
  let spy2 = sinon.spy();
  // Action column generator
  baseVm = mount({
    template: `
              <data-tables :data="data" :action-col="actionCol">
                <el-table-column v-for="title in titles" :prop="title.prop" :label="title.label" :key="title.prop">
               </el-table-column>
              </data-tables >
            `,
    data() {
      return {
        data,
        titles,
        actionCol: {
          label: "Actionsssssss",
          props: {
            align: "center"
          },
          buttons: [
            {
              props: {
                type: "primary",
                icon: "el-icon-edit"
              },
              handler: row => {
                spy1();
                this.$message("Edit clicked");
                row.flow_no = "hello world" + Math.random();
                row.content =
                  Math.random() > 0.5 ? "Water flood" : "Lock broken";
                row.flow_type = Math.random() > 0.5 ? "Repair" : "Help";
              },
              label: "Edit"
            },
            {
              handler: row => {
                spy2();
                let num = this.data.indexOf(row);
                this.data.splice(0, 1);
              },
              label: "delete"
            }
          ]
        }
      };
    }
  });

  it.only("actionCol render", async () => {
    let { table, rows } = getTableItems(baseVm);
    let firstRow = rows.at(0);
    let firstRowTds = firstRow.findAll("td");
    firstRowTds.length.should.equal(4);
    let firstItemTds = firstRowTds.at(0);
    let fouthItemTds = firstRowTds.at(3);
    let button = fouthItemTds.findAll("button");
    // let actionTds = firstRow.findAll('td').at(4)
    // actionTds.contains('button').should.equal(true)
    firstItemTds.text().should.equal("FW201601010001");
    button
      .at(0)
      .text()
      .should.equal("Edit");

    document.getElementsByClassName("el-message").length.should.equal(0);

    // button.at(0).trigger("click");
    
    console.log(new Date())
    await sleep(1000)
    console.log(new Date())

    // document.getElementsByClassName("el-message").length.should.equal(1);
    // spy1.should.have.callCount(10);

    // firstItemTds
    //   .text()
    //   .indexOf("hello world")
    //   .should.not.equal(-1);

    // button.at(1).trigger("click");
    // spy2.should.have.calledOnce;
    // let newRows = baseVm
    //   .find(".el-table")
    //   .find("tbody")
    //   .findAll("tr");
    // let firstNewRow = newRows.at(0);
    // let firstNewRowTds = firstNewRow.findAll("td");
    // let firstNewItemTds = firstNewRowTds.at(0);
    // firstNewItemTds
    //   .text()
    //   .indexOf("hello world")
    //   .should.equal(-1);
    // newRows.length.should.equal(2);
    // newRows.length.should.equal(2)
  });
});
