/** 
 * create author name xiaominzhang
 * create time 2018/8/15
*/
var vue = new Vue({
  el:"#app",
  mounted:function(){
    this.getData(this.select.user,1,10);
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
    pickerOptions1: {
      disabledDate:function(time) {
        return time.getTime() > Date.now();
      },
      shortcuts: [{
        text: '今天',
        onClick:function(picker) {
          picker.$emit('pick', new Date());
        }
      }, {
        text: '昨天',
        onClick:function(picker) {
          const date = new Date();
          date.setTime(date.getTime() - 3600 * 1000 * 24);
          picker.$emit('pick', date);
        }
      }, {
        text: '一周前',
        onClick:function(picker) {
          const date = new Date();
          date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
          picker.$emit('pick', date);
        }
      }]
    }, //首次合作日期
    tableData:[],  //表单数据
    formLabelWidth: '120px',
    currentPage: 1,dialogCostoms: false,
    dialogChance : false,
    db : openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024),
    //客户表头信息
    title_enterprise: {
      add_enterprise:'新增客户',
      edit_enterprise: "编辑客户"
    },
    EnterpriseStatus : '',

    //筛选条件
    select : {
      user : ''
    },

    //新增表单提交
    client : {
      id : '',
      user : '',
      pass : '',
      time : ''
    },
    rules: {//必填项提示
      user : [{required: true, message: '请选择客户类型', trigger: 'blur'}],
      pass : [{required: true, message: '请输入客户全称', trigger: 'blur'}],
      time: [{required: true, message: '请输入客户名称', trigger: 'blur'}],
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
    getData:function(name,currentPage,pageSize){
      this.tableData.length=0;
      var star = currentPage*pageSize-pageSize,
      end = pageSize;
      if(name !=''){
        this.db.transaction(function (tx) {
          tx.executeSql('SELECT * FROM userData WHERE user="'+name+'" order by time desc LIMIT '+star+','+end, [], function (tx, results) {
            vue.tableData =results.rows;
            if(results.rows.length<pageSize){
              vue.pageSize = 10;
            }else{
              vue.pageSize = results.rows.length;
            }
            tx.executeSql('SELECT * FROM userData', [], function (tx, results) {
              vue.total =  results.rows.length;
              }, null);
           }, null);
        });
      }else{
        this.db.transaction(function (tx) {
          tx.executeSql('SELECT * FROM userData order by time desc LIMIT '+star+','+end, [], function (tx, results) {
            vue.tableData =results.rows;
            if(results.rows.length<pageSize){
              vue.pageSize = 10;
            }else{
              vue.pageSize = results.rows.length;
            }
            tx.executeSql('SELECT * FROM userData', [], function (tx, results) {
              vue.total =  results.rows.length;
              }, null);
           }, null);
        });
      }
    },

    //监听搜索条件的变化
    change:function() {
      this.getData(this.select,1,10);  //方法相互调用
    },

    //每页显示数据量变更
    handleSizeChange: function(val) {
      this.getData(this.select,this.currentPage, val);  //方法相互调用
    },

    //页码变更
    handleCurrentChange: function(val) {
      this.getData(this.select,val,this.pageSize);  //方法相互调用
    },
    //添加客户表单信息
    clientprimsData : function(){
      var id = this.client.id,
          user = this.client.user,
          pass = this.client.pass,
          time = this.client.time;
      var data = {
        id : id,
        user : user,
        pass : pass,
        time : time
      }
     
      if(user!='' && pass!='' && time!=''){
        return data;
      }else{
        this.$message('会员数据不能为空!');
        return false;
      }
    },

    //点击添加客户按钮
    addNewEnterprise : function(){
      this.EnterpriseStatus = "add_enterprise";
      this.dialogCostoms = true;
      this.db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM userData', [], function (tx, results) {
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
        tx.executeSql('CREATE TABLE IF NOT EXISTS userData (id,user,pass,time)');
        tx.executeSql('INSERT INTO userData (id,user,pass,time) VALUES (?,?,?,?)',[vue.id,data.user,data.pass,data.time]);
        tx.executeSql('INSERT INTO log (username,name,state,time) VALUES (?,?,?,?)', [localStorage.getItem("user"),"添加会员名称:"+data.user,"添加成功",Date.parse(new Date())]);
        vue.dialogCostoms =  false;
        vue.closeDialog();
        vue.getData(vue.select.user,1,10);
      });
    },

    //修改客户信息
    hasComplete : function(id){
      this.EnterpriseStatus = "edit_enterprise";
      this.dialogCostoms = true;
      //获取当前数据信息
      this.getOnedata(id);
    },

    //获取当前数据
    getOnedata : function(id){
      this.clientDetail,length = 0;
      this.db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM userData where id='+id, [], function (tx, results) {
         vue.clientDetail =results.rows;
         vue.showdata();
        }, null);
     });
    },

    //数据回显展示
    showdata : function(){
      this.client.id = this.clientDetail[0].id;
      this.client.user = this.clientDetail[0].user;
      this.client.pass = this.clientDetail[0].pass;
      this.client.time = this.clientDetail[0].time;
    },

    //修改数据提交
    enterpriseedit : function(){
      var data = this.clientprimsData();
      this.db.transaction(function (tx) {
         tx.executeSql('UPDATE userData SET user=\''+data.user+'\',pass=\''+data.pass+'\',time=\''+data.time+'\'  WHERE id='+data.id);
         tx.executeSql('INSERT INTO log (username,name,state,time) VALUES (?,?,?,?)', [localStorage.getItem("user"),"修改"+vue.clientDetail[0].user+"会员名称为:"+data.user,"修改成功",Date.parse(new Date())]);
         vue.dialogCostoms =  false;
         vue.closeDialog();
         vue.getData(vue.select.user,1,10);
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
          tx.executeSql('DELETE FROM userData WHERE id='+id);
          tx.executeSql('INSERT INTO log (username,name,state,time) VALUES (?,?,?,?)', [localStorage.getItem("user"),"删除会员名称为:"+name,"删除成功",Date.parse(new Date())]);
          vue.getData(vue.select.user,1,10);
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
