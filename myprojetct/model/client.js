/** 
 * create author name xiaominzhang
 * create time 2018/8/19
*/
var vue = new Vue({
  el:"#app",
  mounted(){
    this.request();  //获取管理员数据
    this.getclient();  //获取管理员数据
    this.getData(this.select,1,10);
  },
  data:{
    form:{
        typeId:''
    },
    input: '',
    pageSize : '', //分页
    total : '' ,//总数
    db : openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024),
    currentPage: 1,
    id :'',
    statusinfo : '',
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
    followPlayData : [
      {visttcode:0,visitname:"电话回访"},
      {visttcode:1,visitname:"视频回访"},
      {visttcode:-1,visitname:"面见回访"}
    ],              //跟进方式
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
      customername : '',
      contactname : '',
      status : ''
    },

    //新增回访表单
    visitreturn : {
      id : '',
      clientname : '',
      callbackway : '',
      planname : '',
      contactname : '',
      user : '',
      callbackdate : '',
      noticetime : '',
      status : ''
    },

    //新增必填项提示
    rules: {
      clientname: [{required: true, message: '请选择跟进客户', trigger: 'blur'}],
      callbackway : [{required: true, message: '请选择跟进方式', trigger: 'blur'}],
      planname : [{required: true, message: '请输入计划名', trigger: 'blur'}],
      contactname : [{required: true, message: '请选择跟进人', trigger: 'blur'}],
      callbackdate : [{required: true, message: '请选择跟进时间', trigger: 'blur'}]
    },

    //完成、取消
    ComCanData : {
      id : '',
      time : '',
      info : ''
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

    //请求管理员数据
    request:function(){
      //options1
      this.db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM userData', [], function (tx, results) {
          vue.personData =results.rows;
          }, null);
      });
    },

    //获取客户信息
    getclient : function(){
      this.db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM clientData', [], function (tx, results) {
          vue.clientDetail =results.rows;
          }, null);
      });
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


    //获取联系人
    getCustomer : function(){
      this.crmsContent.length = 0;
      for(var i=0;i<this.clientDetail.length;i++){
        if(this.clientDetail[i].name == this.visitreturn.clientname){
          this.crmsContent.push(this.clientDetail[i]);
        }
      }
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
      this.updateVisit(data1);
    },
      
    //请求页面表单数据
    getData:function(data,currentPage,pageSize){
      this.tableData.length=0;
      var star = currentPage*pageSize-pageSize,
      end = pageSize;
      if(data.customername!='' || data.status!=''){
        if(data.customername!='' && data.status!='' ){
          this.db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM folowdata WHERE planname="'+data.customername+'" AND status="'+data.status+'" order by id desc LIMIT '+star+','+end, [], function (tx, results) {
              vue.tableData =results.rows;
              if(results.rows.length<pageSize){
                vue.pageSize = 10;
              }else{
                vue.pageSize = results.rows.length;
              }
              tx.executeSql('SELECT * FROM folowdata', [], function (tx, results) {
                vue.total =  results.rows.length;
                }, null);
              }, null);
          });
        }else{
          if(data.customername!='' && data.status==''){
            this.db.transaction(function (tx) {
              tx.executeSql('SELECT * FROM folowdata WHERE planname="'+data.customername+'" order by id desc LIMIT '+star+','+end, [], function (tx, results) {
                vue.tableData =results.rows;
                if(results.rows.length<pageSize){
                  vue.pageSize = 10;
                }else{
                  vue.pageSize = results.rows.length;
                }
                tx.executeSql('SELECT * FROM folowdata', [], function (tx, results) {
                  vue.total =  results.rows.length;
                  }, null);
                }, null);
            });
          }else{
            this.db.transaction(function (tx) {
              tx.executeSql('SELECT * FROM folowdata WHERE status="'+data.status+'" order by id desc LIMIT '+star+','+end, [], function (tx, results) {
                vue.tableData =results.rows;
                if(results.rows.length<pageSize){
                  vue.pageSize = 10;
                }else{
                  vue.pageSize = results.rows.length;
                }
                tx.executeSql('SELECT * FROM folowdata', [], function (tx, results) {
                  vue.total =  results.rows.length;
                  }, null);
                }, null);
            });
          }
        }
      }else{
        this.db.transaction(function (tx) {
          tx.executeSql('SELECT * FROM folowdata order by id desc LIMIT '+star+','+end, [], function (tx, results) {
            vue.tableData =results.rows;
            if(results.rows.length<pageSize){
              vue.pageSize = 10;
            }else{
              vue.pageSize = results.rows.length;
            }
            tx.executeSql('SELECT * FROM folowdata', [], function (tx, results) {
              vue.total =  results.rows.length;
              }, null);
            }, null);
        });
      }
      
    },

    //计划详情
    updateVisit : function(id){
      this.db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM folowdata where id='+id, [], function (tx, results) {
          vue.visitShow =results.rows[0];
          }, null);
      });
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
      this.db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM folowdata', [], function (tx, results) {
           //处理id自增涨
          var ids = new Array();
          if(results.rows.length>0){
            for(var i=0;i<results.rows.length;i++){
              ids.push(results.rows[i].id);
            }
            vue.id = Math.max.apply(null, ids)+1;
          }else{
            vue.id = 1;
          }
         }, null);
      });
    },

    //监听搜索条件的变化
    change:function() {
      this.getData(this.select,this.currentPage,this.pageSize);  //方法相互调用
    },
    
     //每页显示数据量变更
     handleSizeChange: function(val) {
      this.getData(this.select,this.currentPage, val);  //方法相互调用
    },

    //页码变更
    handleCurrentChange: function(val) {
      this.getData(this.select,val,this.pageSize);  //方法相互调用
    },

    //新增、修改数据处理
    visitPrimse : function(){
      var id = this.visitreturn.id,
      clientname = this.visitreturn.clientname,
      callbackway = this.visitreturn.callbackway,
      planname = this.visitreturn.planname,
      contactname = this.visitreturn.contactname,
      user = this.visitreturn.user,
      callbackdate = this.visitreturn.callbackdate,
      noticetime = this.visitreturn.noticetime,
      status = 0;
      
      //修改数据
      let data = {
        id : id,
        clientname : clientname,
        callbackway : callbackway,
        planname : planname,
        contactname : contactname,
        user : user,
        callbackdate : callbackdate,
        noticetime : noticetime,
        status : status
      };
     
      //判断跟进时间是否正确
      let iftime = this.getVisitTime(Date.parse(callbackdate),noticetime);
      if(iftime == '等待提醒'){
        //判断必填项
        if(clientname!='' && callbackway!='' && planname!='' && user!='' && callbackdate!=''){
          return data;
        }else{
          if(callbackdate == ''){
            this.$message('跟进时间不能为空!');
          }
          if(user == ''){
            this.$message('跟进人不能为空!');
          }
          if(planname == ''){
            this.$message('计划名称不能为空!');
          }
          if(callbackway == ''){
            this.$message('跟进方式不能为空!');
          }
          if(clientname == ''){
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
    },

    //新增，修改请求处理
    dialogAdd : function(){
       //新增页面表单数据提交
      let para = this.visitPrimse();
      if(para!=false){
        if(para.id ==''){
          this.db.transaction(function (tx) {
            tx.executeSql('INSERT INTO folowdata (id,clientname,callbackway,planname,contactname,user,callbackdate,noticetime,status) VALUES (?,?,?,?,?,?,?,?,?)',[vue.id,para.clientname,para.callbackway,para.planname,para.contactname,para.user,para.callbackdate,para.noticetime,para.status]);
            tx.executeSql('INSERT INTO log (username,name,state,time) VALUES (?,?,?,?)', [localStorage.getItem("user"),"添加客户名称:"+para.planname,"添加成功",Date.parse(new Date())]);
            vue.dialogVisit =  false;
            vue.closeData();
            vue.getData(vue.select,1,10);
          });
        }else{
          this.db.transaction(function (tx) {
            tx.executeSql('UPDATE folowdata SET clientname=\''+para.clientname+'\',callbackway=\''+para.callbackway+'\',planname=\''+para.planname+'\',contactname=\''+para.contactname+'\',user=\''+para.user+'\',callbackdate=\''+para.callbackdate+'\',noticetime=\''+para.noticetime+'\'  WHERE id='+para.id);
            tx.executeSql('INSERT INTO log (username,name,state,time) VALUES (?,?,?,?)', [localStorage.getItem("user"),"修改客户计划完成","添加成功",Date.parse(new Date())]);
            vue.dialogVisit =  false;
            vue.closeDialog();
            vue.getData(vue.select,1,10);
          });
        }
        
      }
    },

    //完成弹出层展示
    hasComplete : function(data,id){
      this.completeCancel = true;
      this.ComcanStatus = "Complete";
      this.show_date = true;
      this.ComCanData.id = id;
      this.statusinfo = data;
    },

    //取消弹出层展示
    hasCancel : function(data,id){
      this.completeCancel = true;
      this.ComcanStatus = "Cancel";
      this.show_date = false;
      this.ComCanData.id = id;
      this.statusinfo = data;
    },

    //处理完成、提交的数据
    hasComCan : function(){
      var id = this.ComCanData.id,
          time = this.ComCanData.time,
          info = this.ComCanData.info;
      
      //完成描述
      let comData = {
        id : id,
        time : time,
        info : info,
        status : 1
      };

      //取消描述
      let CanData = {
        id : id,
        info : info,
        status : -1
      };
      if(this.statusinfo == "完成"){
        if(time !='' && info !=''){
          return comData;
        }else{
          if(info == ''){
            this.$message('完成描述不能为空!');
          }
          if(time == ''){
            this.$message('完成时间不能为空!');
          }
          return false;
        }
      }else{
        if(info !=''){
          return CanData;
        }else{
          if(info == ''){
            this.$message('取消原因不能为空!');
          }
          return false;
        }
      }
    },

    //提交完成、取消的数据
    update : function(){
      var pre = this.hasComCan();
      this.completeCancel = false;
      if(pre !=false){
        if(this.statusinfo == "完成"){
          this.db.transaction(function (tx) {
            tx.executeSql('UPDATE folowdata SET status=\''+pre.status+'\',info=\''+pre.info+'\',time=\''+pre.time+'\'  WHERE id='+pre.id);
            tx.executeSql('INSERT INTO log (username,name,state,time) VALUES (?,?,?,?)', [localStorage.getItem("user"),"客户计划完成，完成内容"+pre.info+"相关信息","添加成功",Date.parse(new Date())]);
            vue.closeDialog();
            vue.getData(vue.select,1,10);
          });
        }else{
          this.db.transaction(function (tx) {
            tx.executeSql('UPDATE folowdata SET status=\''+pre.status+'\',info=\''+pre.info+'\'  WHERE id='+pre.id);
            tx.executeSql('INSERT INTO log (username,name,state,time) VALUES (?,?,?,?)', [localStorage.getItem("user"),"客户计划取消，取消原因"+pre.info+"相关信息","添加成功",Date.parse(new Date())]);
            vue.closeDialog();
            vue.getData(vue.select,1,10);
          });
        }
      }
       
        console.log(this.hasComCan());
    },

    //修改跟进计划
    editVisit : function(){
      this.dialogVisit = true;
      this.VisitStatus = 'edit_visit';
      this.visitreturn.id = this.visitShow.id;
      this.visitreturn.clientname = this.visitShow.clientname;
      this.visitreturn.callbackway = this.visitShow.callbackway;
      this.visitreturn.planname = this.visitShow.planname;
      this.visitreturn.contactname = this.visitShow.contactname;
      this.visitreturn.user = this.visitShow.user;
      this.visitreturn.callbackdate = this.visitShow.callbackdate;
      this.visitreturn.noticetime = this.visitShow.noticetime;
      this.visitreturn.status = this.visitShow.status;
    },
    
    closeData : function(){
      this.visitreturn.id = '';
      this.visitreturn.clientname = '';
      this.visitreturn.callbackway = '';
      this.visitreturn.planname = '';
      this.visitreturn.contactname = '';
      this.visitreturn.user = '';
      this.visitreturn.callbackdate = '';
      this.visitreturn.noticetime = '';
      this.visitreturn.status = '';
    },

    closeDialog : function(){
      this.ComCanData.id = '';
      this.ComCanData.time = '';
      this.ComCanData.info = '';
    }
  },
});