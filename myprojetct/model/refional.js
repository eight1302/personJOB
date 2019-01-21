/** 
 * create author name xiaominzhang
 * create time 2018/8/15
*/
var vue = new Vue({
  el:"#app",
  mounted:function(){
    this.getData(1,10);
  },
  data:{
    form:{
        typeId:''
    },
    input: '',
    id : '',
    clientShow : [], //客户回写
    clientDetail : [],//客户信息
    alltable : [],   //所有的数据
    pageSize : 10, //分页
    total : '' ,//总数
    tableData:[],  //表单数据
    formLabelWidth: '120px',
    currentPage: 1,dialogCostoms: false,
    dialogChance : false,
    db : openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024),
    //客户表头信息
    title_enterprise: {
      add_enterprise:'新增平均薪资',
      edit_enterprise: "编辑平均薪资"
    },
    EnterpriseStatus : '',

    //筛选条件
    select : {
      user : ''
    },

    //新增表单提交
    client : {
      id : '',
      name : '',
      value : ''
    },
    regionadds : {              //销售数据参数请求
      name : '',
      value : ''
    },   
    tableHeight : '', //表单的最大高度设置
  },
  created:function(){
    this.hh();
    window.onresize = () => {
      return (() => {
        this.hh();
      })();
    };
  },
  methods:{
    hh:function(){
      this.tableHeight = window.innerHeight - 80;
    },

    //日期格式转换
    dateFormat:function(row, column) { 
      var date = row[column.property]; 
      if (date == undefined) { 
        return ""; 
      } 
      return moment(Number(date)).format("YYYY-MM-DD"); 
    },

    //请求页面表单数据
    getData:function(currentPage,pageSize){
      this.tableData.length=0;
      var star = currentPage*pageSize-pageSize,
      end = pageSize;
      this.db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM region LIMIT '+star+','+end, [], function (tx, results) {
          vue.tableData =results.rows;
          if(results.rows.length<pageSize){
            vue.pageSize = 10;
          }else{
            vue.pageSize = results.rows.length;
          }
          tx.executeSql('SELECT * FROM region', [], function (tx, results) {
            vue.total =  results.rows.length;
            }, null);
          }, null);
      });
    },

    //监听搜索条件的变化
    change:function() {
      this.getData(1,10);  //方法相互调用
    },

    //每页显示数据量变更
    handleSizeChange: function(val) {
      this.getData(this.currentPage, val);  //方法相互调用
    },

    //页码变更
    handleCurrentChange: function(val) {
      this.getData(val,this.pageSize);  //方法相互调用
    },
    //添加客户表单信息
    clientprimsData : function(){
      var id = this.client.id,
          name = this.client.name,
          value = this.client.value;
      var data = {
        id : id,
        name : name,
        value : value
      }
     
      if(name!='' && value!=''){
        return data;
      }else{
        this.$message('地域数据不能为空!');
        return false;
      }
    },

    //点击添加客户按钮
    addNewEnterprise : function(){
      this.EnterpriseStatus = "add_enterprise";
      this.dialogCostoms = true;
      this.db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM region', [], function (tx, results) {
           //处理id自增涨
          var ids = new Array();
          for(var i=0;i<results.rows.length;i++){
            ids.push(results.rows[i].id);
          }
          vue.id = Math.max.apply(null, ids)+1;
         }, null);
      });
    },
    
    //客户提交数据
    dialogAdd : function(){
      if(this.client.id == ''){
        this.enterpriseAdd();
      }else{
        this.enterpriseedit();
      }
    },

    //提交客户数据
    enterpriseAdd : function(){
      var data = this.clientprimsData();
      this.db.transaction(function (tx) {
        tx.executeSql('INSERT INTO region (id,name,value) VALUES (?,?,?)',[vue.id,data.name,data.value]);
        tx.executeSql('INSERT INTO log (username,name,state,time) VALUES (?,?,?,?)', [localStorage.getItem("user"),"添加地域信息"+data.name+"平均薪资"+data.value,"修改成功",Date.parse(new Date())]);
        vue.dialogCostoms =  false;
        vue.closeDialog();
        vue.getData(1,10);
      });
    },

    //修改客户信息
    hasComplete : function(id,name){
      this.EnterpriseStatus = "edit_enterprise";
      this.dialogCostoms = true;
      //获取当前数据信息
      this.getOnedata(id,name);
    },

    //获取当前数据
    getOnedata : function(id){
      this.clientDetail,length = 0;
      this.db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM region where id='+id, [], function (tx, results) {
         vue.clientDetail =results.rows;
         vue.showdata();
        }, null);
     });
    },

    //数据回显展示
    showdata : function(){
      this.client.id = this.clientDetail[0].id;
      this.client.name = this.clientDetail[0].name;
      this.client.value = this.clientDetail[0].value;
    },

    //修改数据提交
    enterpriseedit : function(){
      var data = this.clientprimsData();
      this.db.transaction(function (tx) {
         tx.executeSql('UPDATE region SET name=\''+data.name+'\',value=\''+data.value+'\' WHERE id='+data.id);
         tx.executeSql('INSERT INTO log (username,name,state,time) VALUES (?,?,?,?)', [localStorage.getItem("user"),"修改地域信息"+data.name+"平均薪资"+data.value,"修改成功",Date.parse(new Date())]);
         vue.dialogCostoms =  false;
         vue.closeDialog();
         vue.getData(1,10);
       });
   },

    closeDialog : function(){
      this.client.id = '';
      this.client.user = '';
      this.client.pass = '';
      this.client.time = '';
    },

    //删除客户数据
    hasCancel:function(id,name){
      this.$confirm('您确定要删除次数据吗?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.db.transaction(function (tx) {
          tx.executeSql('DELETE FROM region WHERE id='+id);
          tx.executeSql('INSERT INTO log (username,name,state,time) VALUES (?,?,?,?)', [localStorage.getItem("user"),"删除地域信息:"+name,"删除成功",Date.parse(new Date())]);
          vue.getData(1,10);
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      }); 
    }
  }
});
