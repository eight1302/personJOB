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
    browser : '', //浏览器版本
    clientShow : [], //客户回写
    clientDetail : [],//客户信息
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
    getData:function(currentPage,pageSize){
      this.tableData.length=0;
      var star = currentPage*pageSize-pageSize,
          end = pageSize;
      this.db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM log LIMIT '+star+','+end, [], function (tx, results) {
          vue.tableData =results.rows;
          if(results.rows.length<pageSize){
            vue.pageSize = 10;
          }else{
            vue.pageSize = results.rows.length;
          }
          
          tx.executeSql('SELECT * FROM log', [], function (tx, results) {
            vue.total =  results.rows.length;
            }, null);
          }, null);
      });
    },

    //每页显示数据量变更
    handleSizeChange: function(val) {
      this.getData(this.currentPage, val);  //方法相互调用
    },

    //页码变更
    handleCurrentChange: function(val) {
      this.getData(val,this.pageSize);  //方法相互调用
    }
  }
});
