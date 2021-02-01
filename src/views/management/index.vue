<template>
  <div class="app-container">
        <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-select v-model="queryInfo.query" clearable placeholder="请输入播种标记查询条件">
          <el-option :value="0" label="漏播"/>
          <el-option :value="1" label="正常"/>
        </el-select>
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="getRowList()">查询</el-button>
      <!-- 出现####是因为表格太小，拉宽即可 -->
        <el-button class="el-icon-upload btn"  type="primary" @click="exportExcel">导出excel表格</el-button>
      <el-button class="btn" plain  @click="open">说明</el-button>
    </el-form>
     
    <!-- 表格区域 -->
      <el-table
        id="row_table" 
        :data="rowList" 
        border 
        stripe
        fit
        highlight-current-row
        lazy
        v-loading="listLoading"
        element-loading-text="数据加载中,请稍后..."
        >
        <el-table-column label="序号" type="index" width="50px"></el-table-column>
        <el-table-column label="经度" prop="longitude" width="110"></el-table-column>
        <el-table-column label="纬度" prop="latitude" width="110"></el-table-column>
        <el-table-column label="播深(mm)" prop="sowdeep" width="60"></el-table-column>
        <el-table-column label="播种标记" prop="sowtag">
          <template slot-scope="scope">
             <!-- {{scope.row}} -->
             <el-switch
              v-model="scope.row.sowtag === 0 ? value1 : value2"
              inactive-color="#13ce66"
              active-color="#ff4949"
              active-text="漏播"
              inactive-text="正常"
              >
            </el-switch>
           </template>
        </el-table-column>
        <el-table-column label="施肥标记" prop="ferttag">
          <template slot-scope="scope">
             <!-- {{scope.row}} -->
             <el-switch
              v-model="scope.row.ferttag === 0 ? value1 : value2"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="正常"
              inactive-text="漏播">
            </el-switch>
           </template>
        </el-table-column>
        <el-table-column label="时间" prop="date">
          <!-- 时间格式化 -->
            <template slot-scope="scope">
              {{scope.row.date | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="镇压力(N)" prop="pressure" width="70"></el-table-column>

        <!-- 操作区域 -->
        <!--自定义操作插槽-->
        <el-table-column label="删除" width="80">
          <template slot-scope="scope">
            <!-- 删除 -->
            <!-- @click="deleteUser(scope.row.id)" 根据id删除信息 -->
            <el-button
            size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteRow(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
        
      </el-table>
      <!-- 分页组件区域 -->
      <!-- 
      size-change	pageSize 改变时会触发 回调参数：每页条数
      current-change	currentPage 改变时会触发 回调参数：当前页
      current-page	当前页数，支持 
      page-sizes	每页显示个数选择器的选项设置
      page-size	每页显示条目个数，
      layout	组件布局，子组件名用逗号分隔
      total	总条目数
       -->
      <div>
         <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pageNum"
      :page-sizes="[1,5, 10, 100]"
      :page-size="queryInfo.pageSize"
      style="padding: 30px 0; text-align: center;"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
      </div>
     
    </el-card>
  </div>
</template>

<script>
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
export default {
  data() {
    return {
      //是否显示加载信息
      listLoading: true,
      //查询信息实体
      queryInfo: {
        query: "",
        pageNum: 1, //查询信息当前页
        pageSize:10, //当前页最大数
        sowtag: 1,
      },
      rowList: [], //存放播种信息列表
      total: 0,//总记录数
      value1: true,
      value2: false,
    };
  },
  created() {
    this.getRowList();
  },
  methods: {
    //通知消息
     open() {
        const h = this.$createElement;
        this.$notify({
          title: '说明',
          dangerouslyUseHTMLString: true,
          message: '<strong color="red">这是 <i>HTML</i> 片段</strong>',
          type: 'success',
          offset: 0
        });
      },
    //获取所有播种信息列表
    async getRowList() {
      //得到后台传来的参数 命名为params
      const { data: res } = await this.$http.get("rowAllMessage", {
        params: this.queryInfo,
      });
      console.log(this.queryInfo);
      //这个data 就是后端定义的所有用户 res.put("data",allUser);
      this.rowList = res.data;
      //  这个data 就是后端定义的所有用户数量 res.put("userNum", userCounts);
      this.total = res.rowNum;
      //数据加载完毕停止加载中
      this.listLoading = false;
    },

     //根据id删除用户
    async deleteRow(id) {
      //打印的是 你点击那个按钮的文字 比如 confirm cancle 
      //第一个参数 是提示信息，第二个是标题，第三个是按钮的信息
      const confirmResult = await this.$confirm('此操作将永久删除此条数据，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancleButtonText: '取消',
        type: 'warning'
      }).catch(err =>err)
      //打印的是 你点击那个按钮的文字 比如 confirm cancle
      console.log(confirmResult);
      if(confirmResult != 'confirm') {
        return this.$message.info("已取消删除！")
      }
      const {data: res} = await this.$http.delete("deleteRow?id=" + id);
      if(res !== "success") {
        return this.$message.error("删除失败！")
      }
      this.$message.success("删除成功");
      this.getRowList();
    },

    //size-change	pageSize 改变时会触发 回调参数：每页条数newSize
    //// 监听pageSize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.getRowList(); // 数据发生改变重新申请数据
    },
    //current-change	currentPage 改变时会触发  回调参数：当前页
    //// 监听pageNum改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage;
      this.getRowList(); // 数据发生改变重新申请数据
    },



    //导出excel文件
    async  exportExcel() {
      this.$confirm("该操作将数据导出为excel文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
      .then(async () => {
        try {
        var wb = XLSX.utils.table_to_book(document.querySelector('#row_table'))
        var wbout = XLSX.write(wb,{bookType: 'xlsx', bookSST: true,type: 'array'})
        FileSaver.saveAs(new Blob([wbout], {type:'application/octer-stream'}), 'row.xlsx')
        this.$message.success("文件导出成功");
      } catch (e) {
        if(typeof console !== 'undefined')
        this.$message.warning("文件导出失败,请稍后再试");
        console.log(e.wbout);
      }
      return wbout;
      })
      .catch(() => {
          this.$message({
            type: "info",
            message: "已终止操作",
          });
        });
    },
  }
};
</script>

<style lang="scss" scoped>

.btn {
  margin-left: 5%;
}
</style>
