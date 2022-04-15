<template>
  <div class="fillcontain">
    <!-- 添加按钮 -->
    <div>
      <el-form :inline="true">
        <!-- 时间筛选 -->
        <el-form-item>
          <el-date-picker
            v-model="start_end"
            type="daterange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="handleSort"
            >筛选</el-button
          >
        </el-form-item>
        <el-form-item
          class="btn-right"
          v-if="permissionUser.identity === 'manager'"
        >
          <el-button type="primary" size="small" @click="handleAdd"
            >添加</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!-- 表单 -->
    <el-table
      :data="tableData"
      style="width: 100%"
      max-height="450"
      border
      v-if="tableData.length > 0"
    >
      <el-table-column type="index" label="序号" align="center" width="70" />
      <el-table-column label="时间" align="center" width="auto" prop="date">
        <template #default="scope">
          <el-icon><Timer /></el-icon>
          <span style="margin-left: 10px">
            {{ scope.row.date.slice(0, 10) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="收支类型"
        align="center"
        width="auto"
        prop="type"
      />
      <el-table-column
        label="收支描述"
        align="center"
        width="auto"
        prop="describe"
      />
      <el-table-column label="收入" align="center" width="auto" prop="income">
        <template #default="scope">
          <span style="color: #00d053"> +{{ scope.row.income }} </span>
        </template>
      </el-table-column>
      <el-table-column label="支出" align="center" width="auto" prop="expend">
        <template #default="scope">
          <span style="color: #f56767"> -{{ scope.row.expend }} </span>
        </template>
      </el-table-column>
      <el-table-column label="现金" align="center" width="auto" prop="cash" />
      <el-table-column label="备注" align="center" width="auto" prop="remark">
        <template #default="scope">
          <span style="color: #4db3ff">
            {{ scope.row.remark }}
          </span>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        width="auto"
        prop="operation"
        v-if="permissionUser.identity === 'manager'"
      >
        <template #default="scope">
          <el-button
            size="small"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >

          <el-popconfirm
            confirm-button-text="确定"
            cancel-button-text="取消"
            :icon="InfoFilled"
            icon-color="red"
            title="确认删除?"
            @confirm="confirmDelete(scope.$index, scope.row)"
            @cancel="cancelDelete"
          >
            <template #reference>
              <el-button size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row>
      <el-col :span="24">
        <div class="pagination">
          <el-pagination
            v-if="total > 0"
            v-model:currentPage="current_page"
            v-model:page-size="page_size"
            :page-sizes="page_sizes"
            small="small"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-col>
    </el-row>
  </div>
  <DialogModal
    :show="show"
    @closeModal="show = false"
    @handleUpdateProfiles="handleUpdateProfiles"
    :editData="editData"
  />
</template>


<script lang="ts" setup>
import DialogModal from "../components/DialogModal.vue";
import { ref, watchEffect } from "vue";
import axios from "../utils/http";
import { Timer } from "@element-plus/icons-vue";
import { formDataType, userType } from "../utils/types";
import { ElMessageBox } from "element-plus";
import { useAuthStore } from "../store/index";

const store = useAuthStore();

const start_end = ref([]);

const current_page = ref(1); //当前位于哪一页
const page_size = ref(5); //每页显示多少条
const page_sizes = [5, 10, 15, 20];
const total = ref(0); //必填，总共多少条

const tableData = ref<formDataType[]>([]); //用来渲染的数组
const allTableData = ref<formDataType[]>([]); //用来分页的
const filterTableData = ref<formDataType[]>([]); //用来过滤时间的

const permissionUser = ref<userType | any>();

const show = ref<boolean>(false);
const editData = ref<formDataType>();

//获取所有数据
const getProfiles = async () => {
  const { data } = await axios("/api/profiles");

  tableData.value = data;
  allTableData.value = data;
  filterTableData.value = data;
  setPaginations();
};
//监听页面
watchEffect(() => {
  getProfiles();

  permissionUser.value = store.getUser;
});

console.log(permissionUser.value.identity);

//获取编辑的数据，使用elementui内置的row传递
const handleEdit = (index: number, row: formDataType) => {
  editData.value = row;
  show.value = true;
};
const confirmDelete = async (index: number, row: formDataType) => {
  await axios.delete(`/api/profiles/delete/${row._id}`);
  getProfiles();
  //@ts-ignore
  ElMessage.success("删除成功");
};
const handleAdd = () => {
  show.value = true;
};
const handleUpdateProfiles = () => {
  getProfiles();
};

//设置分页
const setPaginations = () => {
  total.value = allTableData.value.length;
  current_page.value = 1;
  page_size.value = 5;
  //allTableData作为中介数组，用于划分分页数据范围，确定分页范围后传给真正盛放和展示table数据的tableData
  tableData.value = allTableData.value.filter((item: any, index: number) => {
    //此处index能拿到表单tableData的所有条数

    return index < page_size.value;
  });
};

//改变分页的options
const handleSizeChange = (pages: number) => {
  current_page.value = 1; //当前页数所处位置均默认为1
  page_size.value = pages; //pages为用户点击的options项的页数，点多少pages的就展示多少pages
  //重构数据
  tableData.value = allTableData.value.filter((item: any, index: number) => {
    //index从0开始算起，index = pages - 1，类似数组下标和长度的区别,item为当前项等同于scope.row
    return index < page_size.value;
  });
};

//改变分页的当前页数
const handleCurrentChange = (page: number) => {
  //以点击第二页为例，第二页之前的数据条数为currentPages，第二页开始包括之后的数据条数为overPages
  const currentPages = page_size.value * (page - 1); //*(page-1)是因为：若真实数据为3条，没有达到page_size的5条，则错误，故page必选
  const overPages = allTableData.value.filter((item: any, index: number) => {
    return index >= currentPages;
  });
  // console.log(currentPages);
  //console.log(overPages)
  //若12条数据，点第一页，overPages为12=currentPages，点第二页，overPages为7=12-5，除了第一页，overPages+currentPages=total
  //真正渲染的是翻页的条数
  tableData.value = overPages.filter((item: any, index: number) => {
    return index < page_size.value;
  });
};

//时间筛选
const handleSort = () => {
  if (!start_end.value) {
    //@ts-ignore
    ElMessage.warning("请选择时间范围");
    return getProfiles();
  }

  //根据时间筛选实现过滤
  const startTime = start_end.value[0].getTime(); //getTime()得到时间戳
  const endTime = start_end.value[1].getTime();
  //根据筛选的时间进行分页
  allTableData.value = filterTableData.value.filter((item: any) => {
    const itemTime = new Date(item.date).getTime();
    return itemTime >= startTime && itemTime <= endTime;
  });

  //调用分页功能
  setPaginations();
};
</script>


<style scoped>
.fillcontain {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}

.btn-right {
  float: right;
}

.pagination {
  float: right;
  margin-top: 10px;
}
</style>