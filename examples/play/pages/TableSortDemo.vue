<template>
    <div style="margin: 20px;">
      <div>
        <p>新增多条数据， 先点击排序，再修改数量</p>
        <el-button @click="handleAdd">add</el-button>
        <el-table
          border
          size="mini"
          :data="list"
          :header-cell-style="{background: '#f5f7fa'}"
          @sort-change="sortChange"
        >
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="70">
            <template slot-scope="scope">
              <span>{{ (currentPage - 1) * pageSize + scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <!-- :sort-method="(a, b) => {return a[item.props] - b[item.props]}"  -->
          <el-table-column
            prop="contract"
            label="合约代码"
            sortable
            align="center">
          </el-table-column>
          <el-table-column
            prop="quantity"
            label="数量"
            sortable
            align="center">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.quantity"
                placeholder="请输入" 
                size="mini"
                style="width: 100%" />
            </template>
          </el-table-column>
        </el-table>
        <div style="display: flex; justify-content: flex-end">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :current-page="currentPage"
            :page-size="pageSize" 
            :page-sizes="pageSizeList"
            :total="tableList.length"
            @current-change="handleChangeCurrentPage"
            @size-change="handleSizeChange">    
          </el-pagination>
        </div>
      </div>
    </div>
  </template>
  
  <script>
    let uuid = 1
    export default {
      data() {
        return {
          currentPage: 1,
          pageSize: 10,
          pageSizeList: [10, 20, 50, 100],
          tableList: [
            // {
            //   contract: 'ap12345',
            //   quantity: '1'
            // },
            // {
            //   contract: 'ap12345',
            //   quantity: '2'
            // }
          ]
        };
      },
      computed: {
        list() {
          const startIndex = (this.currentPage - 1) * this.pageSize;
          const endIndex = this.currentPage * this.pageSize;
          return this.tableList.slice(startIndex, endIndex);
        },
      },
      methods: {
        sortChange() {},
        handleAdd() {
          ++uuid;
          this.tableList.push({
            contract: 'ap1234' + uuid,
            quantity: ''
          })
        },
        // 改变当前页码
        handleChangeCurrentPage(val) {
          this.currentPage = val;
        },
        handleSizeChange(val) {
          this.currentPage = 1;
          this.pageSize = val;
        },
      }
    };
  </script>
  
  <style>
    
  </style>
  