/** 
 * create author name xiaominzhang
 * create time 2018/8/19
*/
var vue = new Vue({
  el:"#app",
  mounted(){
    let url = this.vueUrl();
    //页面数据展示
    var visit_url = url+'/crm/callback/listCallBackPlan';
    this.getData(visit_url,this.primsData(1,10));
     //获取回访客户列表信息
     var clienturl = url+'/crm/customer/listCallBackCustomer';
     this.clientName(clienturl);
     //获取跟进人信息
     var followUrl = url+'/crm/callback/listCallBackUser';
     this.follow_Person(followUrl);

     //拜访方式
     var crm_url = url+'/tstypegroup/getTypegroupNoSession';
     this.visitWay(crm_url); //跟进方式
  },
  data:{
    form:{
        typeId:''
    },
    input: '',
    pageSize : '', //分页
    total : '' ,//总数
    currentPage: 1,
    formLabelWidth: '120px',
    dialogVisit: false,
    completeCancel : false,
    show_date : false,                  //完成、取消展示的时间输入框
    tableData : [],                     //客户跟进计划table
    clientDetail : [],                  //客户信息
    crmsContent : [],                   //联系人
    personData : [],                    //跟进人
    visitShow : [],                     //详情信息
    visitStatus : '',                   //详情计划状态
    followUrl : '',                     //跟进记录url
    playvisit : [
      {visttcode:0,visitname:"待完成"},
      {visttcode:1,visitname:"已完成"},
      {visttcode:-1,visitname:"已取消"}
    ],
    setTimeData : [                     //表单提醒时间处理
      {setid:1,setName:"提前一小时"},
      {setid:3,setName:"提前三小时"},
      {setid:24,setName:"提前一天"}
    ],
    followPlayData : [],              //跟进方式
    pickerOptions1: {
      shortcuts: [{
        text: '今天',
        onClick(picker) {
          picker.$emit('pick', new Date());
        }
      }, {
        text: '昨天',
        onClick(picker) {
          const date = new Date();
          date.setTime(date.getTime() - 3600 * 1000 * 24);
          picker.$emit('pick', date);
        }
      }, {
        text: '一周前',
        onClick(picker) {
          const date = new Date();
          date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
          picker.$emit('pick', date);
        }
      }]
    },

    //添加修改表头信息
    title_visit: {
      add_visit:'新增客户跟进计划',
      edit_visit: "编辑客户跟进计划"
    },
    VisitStatus : '',

    //完成、取消表头信息
    title_comcan : {
      Complete : '完成描述',
      Cancel : '取消原因'
    },
    ComcanStatus : '',

    //筛选条件
    select : {
      customer_name : '',
      contact_name : '',
      status : '',
      follow_user_id : '',
      callback_date : ''
    },

    //新增回访表单
    visitreturn : {
      id : '',
      customer_id : '',
      callback_way : '',
      plan_name : '',
      contact_id : '',
      follow_user_id : '',
      callback_date : '',
      notice_time : '',
      status : ''
    },

    //新增必填项提示
    rules: {
      customer_id: [{required: true, message: '请选择跟进客户', trigger: 'blur'}],
      callback_way : [{required: true, message: '请选择跟进方式', trigger: 'blur'}],
      plan_name : [{required: true, message: '请输入计划名', trigger: 'blur'}],
      follow_user_id : [{required: true, message: '请选择跟进人', trigger: 'blur'}],
      callback_date : [{required: true, message: '请选择跟进时间', trigger: 'blur'}]
    },

    //完成、取消
    ComCanData : {
      id : '',
      update_time : '',
      remark : ''
    },

    //完成、取消必填项提示
    rulesComCal : {
      update_time: [{required: true, message: '请选择时间', trigger: 'blur'}],
      remark : [{required: true, message: '请填写描述信息', trigger: 'blur'}]
    },

    height:{height:''},  //详情页统一高度样式
    height1:{height:'',overflow:'auto'}, //客户详情详情页左侧高度样式
    height3:{height:'',overflow:'auto'},//详情页中的详情页左侧高度样式
    followheight:{height:'',overflow:'auto'},  //详情页的根据记录高度样式
    brandheight : {height:'',overflow:'auto'},  //详情页的品牌机会、联系人、店铺标签页高度样式
    heightselect : {height:''},  //筛选条件的高度处理
    width : {width:'',left:''}, //详情页中的详情页宽度处理
    width1 : {width:''}, //筛选条件的宽度
    width2 : {width:''}, //筛选条件的狂赌（两个输入框的问题）
    tableHeight : '', //表单的最大高度设置
  },
  created(){
    this.hh(); //获取页面高度
    this.ww(); //获取页面宽度
    const that = this
    window.onresize = () => {
        return (() => {
          this.hh();
          this.ww();
        })();
    }
  },
  methods:{
    //获取页面高度
    hh(){
      this.height.height=window.innerHeight+'px';
      this.height1.height = window.innerHeight-200+'px';
      this.height3.height = window.innerHeight-100+'px';
      this.followheight.height =window.innerHeight-450+'px';
      this.brandheight.height = window.innerHeight-230+'px';
      this.tableHeight = window.innerHeight - 80;
    },
    //获取页面宽度
    ww(){
      if(window.innerWidth<=1000){
        this.heightselect.height = '150px';
        this.width.width='45%';
        this.width.left = '55%';
        this.width1.width = '120px';
        this.width2.width = '43px';
        this.isB = true;
        this.isA = false;
      }else if(window.innerWidth<=1500 && window.innerWidth>1000){
        this.heightselect.height = 'auto';
        this.width.width='30%';
        this.width.left = '70%';
        this.width1.width = '120px';
        this.width2.width = '43px';
        this.isB = true;
        this.isA = false;
      }else{
        this.heightselect.height = 'auto';
        this.width.width='25%';
        this.width.left = '75%';
        this.width1.width = '210px';
        this.width2.width = '90px';
        this.isB = false;
        this.isA = true;
      }
    },
   
    //获取当前页面的url路径
    vueUrl(){
      var url = location.href.split('/maochao')[0];
      //处理url参数的问题
      let newTime = this.getQueryString('time');
      let status =  Number(this.getQueryString('status'));
      //默认时间筛选条件
      if(newTime!=null){
        this.select.callback_date=[newTime,newTime];
        this.select.status = status;
      }
      this.https = url+'/maochao';
      return this.https;
    },

    //监听url地址的参数
    getQueryString : function(name){
      //获取url参数
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
      var r = window.location.search.substr(1).match(reg);
      if (r != null) {
          return decodeURI(r[2]);
      }
      return null;
    },

     //调整页面路径以及参数添加
     gourl : function(){
      //获取当前日期
      var data = this.times(1); //1表示年月日,2表数年月,3表数选择时间段年月,4表示数据月
      this.followUrl = '/maochao/rhmcrm/view/follow/follow.html?time='+data;
    },

    //获取当前日期
    times : function(date) {
      var myDate = new Date();
      //获取当前年
      var year=myDate.getFullYear();
      //获取当前月
      var month=myDate.getMonth()+1;
      month = month<10?'0'+month:month;
      //获取当前日
      var day=myDate.getDate(); 
      day=day<10?'0'+day:day;
      if(date == 1){
          return year+'-'+month+'-'+day;
      }
    },

    //判断跟进时间是否延期
    getVisitTime : function(followTime,setTime){
      let newTime = Date.parse(new Date());
      //判断当前时间是否大于跟进时间
      if(newTime>followTime){
        return "未处理";
      }else if(newTime>(followTime-setTime*60*60*1000) && newTime<=followTime){
        return "已提醒";
      }else{
        return '等待提醒';
      }
    },

    //客户信息
    clientName : function(url){
      //请求页面表单数据
      this.$http.post(url,{emulateJSON: true}).then((res) => {  //.then() 返回成功的数据
        this.clientDetail = res.data.data;
      })
      .catch(function(res) {
        console.log(res)
      }) 
    },

    //获取联系人信息
    customerContent : function(url,data){
       //请求页面表单数据
       this.$http.post(url,{customerId:data},{emulateJSON: true}).then((res) => {  //.then() 返回成功的数据
        this.crmsContent = res.data.data;
      })
      .catch(function(res) {
        console.log(res)
      }) 
    },

    //获取跟进人信息
    follow_Person : function(url){
       //请求页面表单数据
       this.$http.post(url,{emulateJSON: true}).then((res) => {  //.then() 返回成功的数据
        this.personData = res.data.data;
      })
      .catch(function(res) {
        console.log(res)
      }) 
    },

    //跟进方式
    visitWay(url){
      this.$http.get(url,{params:{
        "page" : '',
        "pageSize" : '-1',
        "typegroupcode" : 'crms_bffs'
      }}).then((res) => {  //.then() 返回成功的数据
        this.followPlayData = res.data.data.result;
      })
      .catch(function(res) {
        this.$message('请求失败');
      }) 
    },

    //获取联系人新
    getCustomer : function(){
      //获取跟进人信息
      let customerId = this.visitreturn.customer_id;
      //获取回访联系人信息
      var contentUrl = this.https+'/crm/contacts/listContacts';
      this.customerContent(contentUrl,customerId);
      //清除上次查询的数据
      this.visitreturn.contact_id = '';
    },

    //日期格式转换
    dateFormat:function(row, column) { 
      var date = row[column.property]; 
      if (date == undefined) { 
        return ""; 
      } 
      return moment(date).format("YYYY-MM-DD HH:mm"); 
    },

    //日期处理
    time : function(date,ss){
      if(ss){
        return moment(date).format("YYYY-MM-DD HH:mm:ss"); 
      }else{
        return moment(date).format("YYYY-MM-DD HH:mm"); 
      }
      
    },

    //提醒时间处理
    remind : function(data){
      switch(data){
        case 1:
          return '提前一小时';
          break;
        case 3: 
          return '提前三小时';
          break;
        default:
          return '提前一天';
      }
    },

    //判断提交数据为有空的对象，去除空对象，同时返回新的对象
    dealElement : function(obj){
      var param = {};
      if ( obj === null || obj === undefined || obj === "" ) return param;
      for ( var key in obj ){
          if ( obj[key] !== null && obj[key] !== undefined && obj[key] !== "" ){
              param[key] = obj[key];
          }
      }
      return param;
    },

    //点击弹出信息
    handleEdit(data1,data2) {
      $('.detail-bg').show();
      $('.detail').show();
      //退出遮盖层
      $('.detail-bg').on('click',function(){
        $('.detail').hide();
        $('.detail-bg').hide();
      });
      //点击按钮，退出遮盖层
      $('.cancel').on('click',function(){
        $('.detail').hide();
        $('.detail-bg').hide();
      });
      //请求详情信息
      let url = this.https+'/crm/callback/getCallBackPlan';
      this.updateVisit(url,{id:data1});
      //跟进记录url以及参数
      this.gourl();
    },
      
    getData:function(url,data){
      //请求页面表单数据
      this.$http.post(url,data,{emulateJSON: true}).then((res) => {  //.then() 返回成功的数据
        this.tableData = res.data.data.data;
        this.pageSize = data.rows;
        this.total = res.data.data.totalCount;
      })
      .catch(function(res) {
          console.log(res)
      }) 
    },

    //计划详情
    updateVisit : function(url,id){
       //请求页面表单数据
       this.$http.post(url,id,{emulateJSON: true}).then((res) => {  //.then() 返回成功的数据
        this.visitShow = res.data.data;
        this.visitStatus =  res.data.data.status;
      })
      .catch(function(res) {
          console.log(res)
      }) 
    },

    //请求筛选数据的prims数据
    primsData : function(page,pageSize){
      var page = page,
          pageSize = pageSize,
          customer_name = this.select.customer_name,
          contact_name = this.select.contact_name,
          status = this.select.status,
          follow_user_id =  this.select.follow_user_id,
          startTime = this.select.callback_date?this.select.callback_date[0]+' 00:00:00':'';
          endTime =  this.select.callback_date?this.select.callback_date[1]+' 23:59:59':'';

      let visitBack = {
        page : page,
        rows : pageSize,
        customer_name : customer_name,
        contact_name : contact_name,
        status : status,
        follow_user_id : follow_user_id,
        startTime : startTime,
        endTime : endTime
      };
    return visitBack;
    },

    //新增跟进计划按钮
    addvisit : function(){
      this.dialogVisit = true;
      this.VisitStatus = 'add_visit';
      this.closeData();
    },

    //监听搜索条件的变化
    change:function() {
      var labelurl = this.https+'/crm/callback/listCallBackPlan';
      this.$options.methods.getData.bind(this)(labelurl,this.$options.methods.primsData.bind(this)(this.currentPage,this.pageSize));  //方法相互调用
    },
    
     //每页显示数据量变更
     handleSizeChange: function(val) {
      var labelurl = this.https+'/crm/callback/listCallBackPlan';
      this.$options.methods.getData.bind(this)(labelurl,this.$options.methods.primsData.bind(this)(this.currentPage, val));
    },

    //页码变更
    handleCurrentChange: function(val) {
      var labelurl = this.https+'/crm/callback/listCallBackPlan';
      this.$options.methods.getData.bind(this)(labelurl,this.$options.methods.primsData.bind(this)(val,this.pageSize));
    },

    //新增、修改数据处理
    visitPrimse : function(){
      var id = this.visitreturn.id,
          customer_id = this.visitreturn.customer_id,
          customer_name = '',
          callback_way = this.visitreturn.callback_way,
          plan_name = this.visitreturn.plan_name,
          contact_id = this.visitreturn.contact_id,
          contact_name = '',
          follow_user_id = this.visitreturn.follow_user_id,
          follow_user_name = '',
          callback_date = this.time(this.visitreturn.callback_date,'ss'),
          status = this.visitreturn.status?this.visitreturn.status:0,
          notice_time = this.visitreturn.notice_time;
      //获取客户名称
      for(let i=0;i<this.clientDetail.length;i++){
        if(this.clientDetail[i].id == customer_id){
          customer_name = this.clientDetail[i].introduce;
        }
      }

      //获取联系人名称
      for(let i=0;i<this.crmsContent.length;i++){
        if(this.crmsContent[i].id == contact_id){
          contact_name = this.crmsContent[i].name;
        }
      }

      //获取跟进人的名称
      for(let i=0;i<this.personData.length;i++){
        if(this.personData[i].id == follow_user_id){
          follow_user_name = this.personData[i].firstname;
        }
      }
      
      //修改数据
      let data = {
        id : id,
        customer_id : customer_id,
        customer_name : customer_name,
        callback_way : callback_way,
        plan_name : plan_name,
        contact_id : contact_id,
        contact_name : contact_name,
        follow_user_id : follow_user_id,
        follow_user_name : follow_user_name,
        callback_date : callback_date,
        status : status,
        notice_time : notice_time
      };
      //新增数据
      let data1 = {
        customer_id : customer_id,
        customer_name : customer_name,
        callback_way : callback_way,
        plan_name : plan_name,
        contact_id : contact_id,
        contact_name : contact_name,
        follow_user_id : follow_user_id,
        follow_user_name : follow_user_name,
        callback_date : callback_date,
        status : status,
        notice_time : notice_time
      }
      
      //判断跟进时间是否正确
      let iftime = this.getVisitTime(Date.parse(callback_date),notice_time);
      if(iftime == '等待提醒'){
        //判断必填项
        if(customer_id!='' && callback_way!='' && plan_name!='' && follow_user_id!='' && callback_date!=''){
          if(id == ''){
            return data1;
          }else{
            return data;
          }
        }else{
          if(callback_date == ''){
            this.$message('跟进时间不能为空!');
          }
          if(follow_user_id == ''){
            this.$message('跟进人不能为空!');
          }
          if(plan_name == ''){
            this.$message('计划名称不能为空!');
          }
          if(callback_way == ''){
            this.$message('跟进方式不能为空!');
          }
          if(customer_id == ''){
            this.$message('跟进客户不能为空!');
          }
          return false;
        }
      }else{
        if(Date.parse(new Date())>Date.parse(callback_date)){
          this.$message('跟进时间不符!');
        }else if(Date.parse(new Date())>(Date.parse(callback_date)-notice_time*60*60*1000)){
          this.$message('提醒时间不符!');
        }
        return false;
      }
     console.log(iftime);

      
    },

    //新增，修改请求处理
    dialogAdd : function(){
      let url = this.https+'/crm/callback/modifyCallBackPlan';
      let table = this.https+'/crm/callback/listCallBackPlan';
      let visitdate = this.visitPrimse();
      if(visitdate!=false){
        this.$http.post(url,visitdate,{emulateJSON: true}).then((res) => {  //.then() 返回成功的数据
          if(res.data.status == "0"){
            if(!visitdate.id){
              this.$message('添加跟进机会成功');
            }else{
              this.$message('修改跟进机会成功');
              //请求详情信息
              let url = this.https+'/crm/callback/getCallBackPlan';
              this.updateVisit(url,{id:visitdate.id});
            }
            //调用列表接口
            this.dialogVisit=false;
            this.$options.methods.getData.bind(this)(table,this.primsData(1,10));
            this.$options.methods.closeData.bind(this)();//清空数据
          }else{
            this.$message('操作失败');
          }
        })
        .catch(function(res) {
            console.log(res)
        }) 
      }
    },

    //完成弹出层展示
    hasComplete : function(data,id){
      this.completeCancel = true;
      this.ComcanStatus = "Complete";
      this.show_date = true;
      this.ComCanData.id = id;
      this.ComCanData.update_time = '';
      this.ComCanData.remark = '';
    },

    //取消弹出层展示
    hasCancel : function(data,id){
      this.completeCancel = true;
      this.ComcanStatus = "Cancel";
      this.show_date = false;
      this.ComCanData.id = id;
      this.ComCanData.textarea = '';
    },

    //处理完成、提交的数据
    hasComCan : function(data){
      var id = this.ComCanData.id,
          update_time = this.ComCanData.update_time,
          status = this.ComCanData.status,
          remark = this.ComCanData.remark;
      
      //完成描述
      let comData = {
        id : id,
        update_time : update_time,
        remark : remark,
        status : 1
      };

      //取消描述
      let CanData = {
        id : id,
        remark : remark,
        status : -1
      };
      if(data == "完成"){
        if(update_time !='' && remark !=''){
          return comData;
        }else{
          if(remark == ''){
            this.$message('完成描述不能为空!');
          }
          if(update_time == ''){
            this.$message('完成时间不能为空!');
          }
          return false;
        }
      }else{
        if(remark !=''){
          return CanData;
        }else{
          if(remark == ''){
            this.$message('取消原因不能为空!');
          }
          return false;
        }
      }
    },

    //提交完成、取消的数据
    update : function(){
      let dataPrimse = '';
      let url = this.https+'/crm/callback/updateCallBackPlanStatus';
      if(this.ComcanStatus == 'Complete'){
        dataPrimse = this.hasComCan('完成');
      }else{
        dataPrimse = this.hasComCan('取消');
      }
      this.$http.post(url,dataPrimse,{emulateJSON: true}).then((res) => {  //.then() 返回成功的数据
        if(res.data.status == "0"){
          this.$message('操作成功');
          this.completeCancel = false;
          let table = this.https+'/crm/callback/listCallBackPlan';
          this.$options.methods.getData.bind(this)(table,this.primsData(1,10));
        }else{
          this.$message('操作失败');
        }
      })
      .catch(function(res) {
          console.log(res)
      }) 
      console.log(dataPrimse);
    },

    //修改跟进计划
    editVisit : function(){
      this.dialogVisit = true;
      this.VisitStatus = 'edit_visit';
      //最新修改列表，页面展示
      this.showData();
    },

    //展示修改数据信息
    showData : function(){
      //获取回访联系人信息
      var contentUrl = this.https+'/crm/contacts/listContacts';
      this.customerContent(contentUrl,this.visitShow.customerId);
      
      //页面赋值
      this.visitreturn.id = this.visitShow.id;
      this.visitreturn.customer_id = this.visitShow.customerId;
      this.visitreturn.callback_way = this.visitShow.callbackWay;
      this.visitreturn.plan_name = this.visitShow.planName;
      this.visitreturn.contact_id = this.visitShow.contactId;
      this.visitreturn.follow_user_id = this.visitShow.followUserId;
      this.visitreturn.callback_date = this.time(this.visitShow.callbackDate);
      this.visitreturn.notice_time = this.visitShow.noticeTime;
      this.visitreturn.status = this.visitShow.status;
    },
    
    closeData : function(){
      this.visitreturn.id = '';
      this.visitreturn.customer_id = '';
      this.visitreturn.callback_way = '';
      this.visitreturn.plan_name = '';
      this.visitreturn.contact_id = '';
      this.visitreturn.follow_user_id = '';
      this.visitreturn.callback_date = '';
      this.visitreturn.notice_time = '';
      this.visitreturn.status = '';
    },

    //跳转页面到跟进记录中
    //页面调整处理
    PageTypes : function(url,target){
      let  windowUrl = parent.location.href.split('/');
      let dfm = '';
      for(let i=0;i<windowUrl.length;i++){
          if(windowUrl[i] == 'dform'){
              dfm = windowUrl[i];
          }
      }
      if(dfm != ''){
          this.openPageTypes({id:'',
          title:target,
          url:url});
      }else{
          window.location.href = url;
      }
    },
    //判断在ibos中，弹出新的标签页
    openPageTypes : function(obj){
        window.parent.addTabs(obj);
    },
  },
});