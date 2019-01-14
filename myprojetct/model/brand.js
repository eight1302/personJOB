/** 
 * create author name xiaominzhang
 * create time 2018/8/19
*/
var vue = new Vue({
  el:"#app",
  mounted(){
     
  },
  data:{
    form:{
        typeId:''
    },
    input: '',
    pageSize : '', //分页
    total : '' ,//总数
    crmssaleChance : [],//销售机会
    clientDetail : [],//客户信息
    tableData:[],  //表单数据
    options1 : [], //负责人信息
    customerDetail : [],//联系人
    followData : [],//跟进数据
    commentInfo : [],//跟进评论
    https : '',//页面请求前缀
    visit : [], //跟进方式
    policy : [],//决策人信息
    importance : [{typename:"五星",id:'5'},{typename:"四星",id:'4'},{typename:"三星",id:'3'},{typename:"二星",id:'2'},{typename:"一星",id:'1'}],//重要程度
    formLabelWidth: '120px',
    crms_hzpt : '',crms_khlx : '',crms_khzt : '',crms_khjb : '',crms_khqmd : '',crms_khbq : '',crms_khly : '',crms_brand : '',
    crms_frm_start : '',crms_frm_end : '',crms_fzr : '',last_time : '',creat_time : '',first_time : '',currentPage: 1,dialogCostoms: false,
    brandShow : [],//品牌数据回写
    activeName : 'first', //tab页
    dialogbrand : false,
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
    //品牌合作机会新增修改表单表头修改
    title_brand: {
      add_brand:'新增品牌合作机会',
      edit_brand: "编辑品牌合作机会"
    },
    BrandStatus : '',
    //设置、显示与隐藏
    show_amount:false,show_importance:false,show_principal:false,show_policymaker:false,show_follow:false,show_purchases:false,
    amount:false,brandimportance:false,principal:false,policymaker:false,showfollow:false,purchases:false,

    //筛选条件
    select : {
      brand_name : '',
      customer_name : '',
      estimated_amount_start : '',
      estimated_amount_end : '',
      sales_stage : '',
      degree_of_importance : ''
    },

    //新增表单提交
    brand : {
      id : '',
      brand_name : '',
      brand_plan_code : '',
      customer_id : '',
      policymaker_id : '',
      principal_id : '',
      sales_stage : '',
      degree_of_importance : '',
      plan_cooperation_date : '',
      last_follow_up_date : '',
      estimated_amount : ''
    },

    rules: {//必填项提示
      brand_name: [{required: true, message: '请输入品牌机会名称', trigger: 'blur'}],
      customer_id : [{required: true, message: '请选择客户', trigger: 'blur'}],
      policymaker_id : [{required: true, message: '请选择负责人', trigger: 'blur'}],
      principal_id: [{required: true, message: '请选择决策人', trigger: 'blur'}],
      sales_stage : [{required: true, message: '请选择销售阶段', trigger: 'blur'}],
      degree_of_importance : [{required: true, message: '请选择重要程度', trigger: 'blur'}],
      last_follow_up_date : [{required: true, message: '请选择最后跟进时间', trigger: 'blur'}],
      estimated_amount : [{type: 'number', message: '预计金额必须数字'}]
    },

    //修改品牌机会的销售机会
    upChanceData : {
      id : '',
      sales_stage : ''
    },

    //更近记录
    records :{
      customer_id : '',
      follow_up_way : '',
      follow_up_play : '',
      follow_up_on_date : '',
      leader_instructions : '',
      remark : ''
    },

    //跟进记录评论
    textarea : {
      theme_id : '',
      context : '',
      type : '跟进记录'
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
        this.width.width='95%';
        this.width.left = '5%';
        this.width1.width = '120px';
        this.width2.width = '43px';
        this.isB = true;
        this.isA = false;
        $('.brandhtml').find(".el-dialog").css({"width":this.width.width});
        $('.shophtml').find(".el-dialog").css({"width":this.width.width});
        $('.customerhtml').find(".el-dialog").css({"width":this.width.width});
      }else if(window.innerWidth<=1500 && window.innerWidth>1000){
        this.heightselect.height = 'auto';
        this.width.width='85%';
        this.width.left = '15%';
        this.width1.width = '120px';
        this.width2.width = '43px';
        this.isB = true;
        this.isA = false;
        $('.brandhtml').find(".el-dialog").css({"width":this.width.width});
        $('.shophtml').find(".el-dialog").css({"width":this.width.width});
        $('.customerhtml').find(".el-dialog").css({"width":this.width.width});
      }else{
        this.heightselect.height = 'auto';
        this.width.width='70%';
        this.width.left = '30%';
        this.width1.width = '210px';
        this.width2.width = '90px';
        this.isB = false;
        this.isA = true;
        $('.brandhtml').find(".el-dialog").css({"width":this.width.width});
        $('.shophtml').find(".el-dialog").css({"width":this.width.width});
        $('.customerhtml').find(".el-dialog").css({"width":this.width.width});
      }
    },
   
    //获取当前页面的url路径
    vueUrl(){
      var url = location.href.split('/maochao')[0];
      this.https = url+'/maochao';
      return this.https;
    },

    //获取url的参数，并且进行查询数据
     geturldata:function(){
      var brand = this.getQueryString('brand');
      if(brand!=null){
        this.select.brand_name=brand;
        this.change();
      }else{
        this.change();
      }
    },

    //获取url参数
    getQueryString : function(name){
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
      var r = window.location.search.substr(1).match(reg);
      if (r != null) {
          return decodeURI(r[2]);
      }
      return null;
    },

    //销售机会
    saleChance(url){
      this.$http.get(url,{params:{
        "page" : '',
        "pageSize" : '-1',
        "typegroupcode" : 'crms_xsjh'
      }}).then((res) => {  //.then() 返回成功的数据
        this.crmssaleChance = res.data.data.result;
      })
      .catch(function(res) {
          console.log(res)
      }) 
    },

    //客户信息
    clientName(url){
      //请求页面表单数据
      let para = {
        pageSize: -1
      };
      this.$http.post(url,para,{emulateJSON: true}).then((res) => {  //.then() 返回成功的数据
      this.clientDetail = res.data.data.result;
      })
      .catch(function(res) {
        console.log(res)
      }) 
    },

    //公司成员请求
    request(url){
      this.$http.get(url).then((res) => {  //.then() 返回成功的数据
        this.options1 = res.data.data.result;
      })
      .catch(function(res) {
          console.log(res)
      }) 
    },

    //联系人
    customerData:function(url,id){
      //请求页面表单数据
      let para = {
        pageSize: -1,
        paramsJson : JSON.stringify({"a.customer_id":"='"+id+"'"})
      };

      this.$http.post(url,para,{emulateJSON: true}).then((res) => {  //.then() 返回成功的数据
        this.customerDetail = res.data.data.result;
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
        this.visit = res.data.data.result;
      })
      .catch(function(res) {
          console.log(res)
      }) 
    },

    //决策人信息
    policymaker(id){
      var lxrurl = this.https+'/crm/contacts/getList';
      this.customerData(lxrurl,id); //联系人信息
    },

    //获取当前登录用户的信息
    getUserInfo(url){
      this.$http.get(url).then((res) => {  //.then() 返回成功的数据
        this.brand.principal_id = res.data.data.userId;
      })
      .catch(function(res) {
          console.log(res)
      }) 
    },

    //联系方式转换
    customerWay : function(data){
      if(data !='' && data != undefined){
        var contact = JSON.parse(data);
        if(typeof(contact) == "object"){
          try{
            return (contact.type?contact.type:'')+' '+(contact.val?contact.val:'-');
          }catch(error){
            return data;
          }
        }else{
          return contact;
        }
      }else{
        return '-';
      }
    },

    //日期格式转换
    dateFormat:function(row, column) { 
      var date = row[column.property]; 
      if (date == undefined) { 
        return ""; 
      } 
      return moment(date.time).format("YYYY-MM-DD"); 
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
      var url = this.https+'/crm/cbCooperation/getDataById';
      this.$options.methods.brandbackData.bind(this)(url,data1);
    },
      
    getData:function(url,data,pageNum,pageSize){
      //请求页面表单数据
      let para = {
          page: pageNum,
          pageSize: pageSize,
          paramsJson : JSON.stringify(data)
      };
      this.$http.post(url,para,{emulateJSON: true}).then((res) => {  //.then() 返回成功的数据
        this.tableData = res.data.data.result;
        this.pageSize = res.data.data.pageSize;
        this.total = res.data.data.totalCount;
      })
      .catch(function(res) {
          console.log(res)
      }) 
    },

    //把首次默认展示数据提交到localstorng中
    firstlocaldata : function(){
      localStorage.setItem("amount",false);localStorage.setItem("show_amount",false);//预计金额
      localStorage.setItem("brandimportance",true);localStorage.setItem("show_importance",true);//主要程度
      localStorage.setItem("principal",true);localStorage.setItem("show_principal",true); //我方负责人
      localStorage.setItem("policymaker",true);localStorage.setItem("show_policymaker",true);//对方决策人
      localStorage.setItem("showfollow",false);localStorage.setItem("show_follow",false);  //跟进时间
      localStorage.setItem("purchases",false);localStorage.setItem("show_purchases",false); //预计合作时间
      this.localdata();//加载展示数据
    },

    //表单数据展示与隐藏设置
    showHide : function(show){
      switch(show){
        case 'show_amount' : if(this.show_amount == false){localStorage.setItem("amount",true);localStorage.setItem("show_amount",true);this.amount = true;return this.show_amount = true;}else{localStorage.setItem("amount",false);localStorage.setItem("show_amount",false); this.amount = false;return this.show_amount = false; }break;
        case 'show_importance' :if(this.show_importance === false){localStorage.setItem("brandimportance","true");localStorage.setItem("show_importance","true");this.brandimportance = true;return this.show_importance = true;}else{localStorage.setItem("brandimportance","false");localStorage.setItem("show_importance","false");this.brandimportance = false;return this.show_importance = false;} break;
        case 'show_principal' : if(this.show_principal === false){localStorage.setItem("principal","true");localStorage.setItem("show_principal","true"); this.principal = true;return this.show_principal = true;}else{localStorage.setItem("principal","false");localStorage.setItem("show_principal","false");this.principal = false;return this.show_principal = false;}break;
        case 'show_policymaker' : if(this.show_policymaker === false){localStorage.setItem("policymaker","true");localStorage.setItem("show_policymaker","true");this.policymaker = true;return this.show_policymaker = true;}else{localStorage.setItem("policymaker","false");localStorage.setItem("show_policymaker","false");this.policymaker = false;return this.show_policymaker = false;}break;
        case 'show_follow' : if(this.show_follow === false){localStorage.setItem("showfollow","true");localStorage.setItem("show_follow","true");this.showfollow = true; return this.show_follow = true;}else{localStorage.setItem("showfollow","false");localStorage.setItem("show_follow","false");this.showfollow = false;return this.show_follow = false;}break;
        case 'show_purchases' : if(this.show_purchases === false){localStorage.setItem("purchases","true"); localStorage.setItem("show_purchases","true");this.purchases = true;return this.show_purchases = true;}else{localStorage.setItem("purchases","false");localStorage.setItem("show_purchases","false"); this.purchases = false;return this.show_purchases = false;} break;
      }
    },

    //请求刘篮球的localstrong中的数据
    localdata : function(){
      var key = localStorage.getItem("show_amount");
      if(key != null){
        //判断预计金额显示或隐藏
        if(localStorage.show_amount == 'true'){this.show_amount = true;this.amount =  true;}else{this.show_amount = false;this.amount =  false;}
        //判断主要程度显示或隐藏
        if(localStorage.show_importance == 'true'){this.show_importance = true;this.brandimportance =  true;}else{this.show_importance = false;this.brandimportance =  false;}
        //判断我方负责人显示或隐藏
        if(localStorage.show_principal == 'true'){this.show_principal = true;this.principal =  true;}else{this.show_principal = false;this.principal =  false;}
        //判断对方决策人显示或隐藏
        if(localStorage.show_policymaker == 'true'){this.show_policymaker = true;this.policymaker =  true;}else{this.policymaker = false;this.show_policymaker =  false;}
        //判断跟进时间显示或隐藏
        if(localStorage.show_follow == 'true'){this.show_follow = true;this.showfollow =  true;}else{this.showfollow = false;this.show_follow =  false;}
        //判断预计合作时间显示或隐藏
        if(localStorage.show_purchases == 'true'){this.show_purchases = true;this.purchases =  true;}else{this.purchases = false;this.show_purchases =  false;}
      }else{
        this.firstlocaldata();
      }
    },

    //重要程度
    importanceColumn(row, column) {
      switch(row.degree_of_importance){
        case 1:
          return '一星';
          break;
        case 2:
          return '二星';
          break;
        case 3:
          return '三星';
          break;
        case 4:
          return '四星';
        case 5:
          return '五星';
          break;
        default:
          return '-';
      }
    },

    //请求数据的prims数据
    primsData : function(){
      var brand_name = this.select.brand_name?" LIKE "+"'%"+this.select.brand_name+"%'":'',
          customer_name = this.select.customer_name?" LIKE "+"'%"+this.select.customer_name+"%'":'',
          estimated_amount_start = this.select.estimated_amount_start?this.select.estimated_amount_start:'',
          estimated_amount_end = this.select.estimated_amount_end?this.select.estimated_amount_end:'',
          sales_stage = this.select.sales_stage?"='"+this.select.sales_stage+"'":'',
          degree_of_importance = this.select.degree_of_importance?"='"+this.select.degree_of_importance+"'":'';
         
      var estimated_amount = '';  //金额的范围选择
      if(estimated_amount_start!='' && estimated_amount_end!=''){
        estimated_amount = ' BETWEEN '+"'"+estimated_amount_start+"'"+' AND '+"'"+estimated_amount_end+"'";
      }

      return paramsJson ={
        "a.brand_name" : brand_name,
        "a.customer_name" : customer_name,
        "a.estimated_amount" : estimated_amount,
        "a.sales_stage" : sales_stage,
        "a.degree_of_importance" : degree_of_importance
      };
    },

    //新增品牌机会按钮
    addNewbrand : function(){
      this.BrandStatus = 'add_brand';
      var userurl = this.https+'/survey/json/getUserInfo.json';
      this.getUserInfo(userurl); //获取当前登陆用户
      this.dialogCostoms = true;
      this.$options.methods.closeDialog.bind(this)();//清空数据
    },

    //添加品牌计划
    brandPrimsData : function(){
      var id = this.brand.id,
          brand_name = this.brand.brand_name,
          brand_plan_code = this.brand.brand_plan_code,
          customer_id = this.brand.customer_id,
          policymaker_id = this.brand.policymaker_id,
          principal_id = this.brand.principal_id,
          sales_stage = this.brand.sales_stage,
          degree_of_importance = this.brand.degree_of_importance,
          plan_cooperation_date = this.brand.plan_cooperation_date?moment(this.brand.plan_cooperation_date).format("YYYY-MM-DD HH:MM:SS"):'',
          last_follow_up_date = this.brand.last_follow_up_date?moment(this.brand.last_follow_up_date).format("YYYY-MM-DD HH:MM:SS"):'',
          estimated_amount  = this.brand.estimated_amount?this.brand.estimated_amount:'',
          policymaker = '',
          brand_plan_code = '',
          customer_name = '',
          principal_name = '';

      //动态生成商品编码
      if(brand_plan_code == ''){
        brand_plan_code = this.$options.methods.brandCode.bind(this)();
      }

      //获取决策人信息
      for(var i=0;i<this.customerDetail.length;i++){
        if(policymaker_id == this.customerDetail[i].id){
          policymaker = this.customerDetail[i].name;
        }
      }

      //获取负责人名称
      for(var i=0;i<this.options1.length;i++){
        if(principal_id == this.options1[i].id){
          principal_name = this.options1[i].firstname;
        }
      }

      //获取联系人名称
      for(var i=0;i<this.clientDetail.length;i++){
        if(customer_id == this.clientDetail[i].id){
          customer_name = this.clientDetail[i].name;
        }
      }

      var data = {
        id : id,
        brand_name : brand_name,
        brand_plan_code : brand_plan_code,
        customer_id : customer_id,
        policymaker_id : policymaker_id,
        principal_id : principal_id,
        sales_stage : sales_stage,
        degree_of_importance : degree_of_importance,
        plan_cooperation_date : plan_cooperation_date,
        last_follow_up_date : last_follow_up_date,
        estimated_amount  : estimated_amount,
        brand_plan_code : brand_plan_code,
        customer_name : customer_name,
        principal_name : principal_name,
        policymaker : policymaker
      }

      //判断品牌合作机会名称不能为空
      if(brand_name !='' && customer_id != '' && policymaker_id != '' && principal_id != '' && sales_stage != '' && degree_of_importance != '' && last_follow_up_date != ''){
        return this.dealElement(data);
      }else{
        if(last_follow_up_date == ''){
          this.$message('最后跟进时间不能为空');
        }
        if(degree_of_importance == ''){
          this.$message('重要程度不能为空');
        }
        if(sales_stage == ''){
          this.$message('销售机会不能为空');
        }
        if(principal_id == ''){
          this.$message('负责人不能为空');
         
        }
        if(policymaker_id == ''){
          this.$message('决策人不能为空');
        }
        if(customer_id == ''){
          this.$message('客户不能为空');
        }
        if(brand_name == ''){
          this.$message('品牌合作机会名称不能为空');
        }
      }
    },

    //动态生成品牌编码
    brandCode :function(){
      var oDate = new Date(); //实例一个时间对象；
      var times = moment(oDate).format("YYYYMMDDHHMMSS");
      return 'RHM'+times;
    },

    //监听搜索条件的变化
    change:function() {
      var labelurl = this.https+'/crm/cbCooperation/getList';
      this.$options.methods.getData.bind(this)(labelurl,this.$options.methods.primsData.bind(this)(),this.currentPage,this.pageSize);  //方法相互调用
    },
    
     //每页显示数据量变更
     handleSizeChange: function(val) {
      var labelurl = this.https+'/crm/cbCooperation/getList';
      this.$options.methods.getData.bind(this)(labelurl,this.$options.methods.primsData.bind(this)(),this.currentPage, val);
    },

    //页码变更
    handleCurrentChange: function(val) {
      var pageNo = this.currentPage;
      var pageSize = this.pageSize;
      var labelurl = this.https+'/crm/cbCooperation/getList';
      this.$options.methods.getData.bind(this)(labelurl,this.$options.methods.primsData.bind(this)(),val,this.pageSize);
    },

    //判断品牌合作机会
    dialogAdd : function(){
      if(this.brand.id == ''){
        this.brandAdd();
      }else{
        this.dialogedit();
      }
    },

    //添加品牌合作机会表单信息
    brandAdd : function(){
      var url = this.https+'/crm/cbCooperation/insertData'; 
      var labelurl = this.https+'/crm/cbCooperation/getList';
      //新增页面表单数据提交
      let para = {
        dataJson : JSON.stringify(this.$options.methods.brandPrimsData.bind(this)())
      };
      if(para.dataJson != undefined){
        this.$http.post(url,para,{emulateJSON: true}).then((res) => {  //.then() 返回成功的数据
          if(res.data.status == "success"){
            this.$message('创建品牌合作机会成功');
            //调用列表接口
            this.$options.methods.getData.bind(this)(labelurl,this.$options.methods.primsData.bind(this)(),1, 10);
            this.$options.methods.closeDialog.bind(this)();//清空数据
            this.dialogCostoms=false;
          }else{
            this.$message('创建品牌合作机会失败');
          }
          
        })
        .catch(function(res) {
          this.$message('创建品牌合作机会失败');
        }) 
      }
    }, 

    //合作机会回写到修改页面中
    editBrand : function(){
      this.BrandStatus = "edit_brand";
      this.dialogCostoms=true;
      this.brand.id = this.brandShow.id;
      this.brand.brand_name = this.brandShow.brand_name;
      this.brand.brand_plan_code = this.brandShow.brand_plan_code;
      this.brand.customer_id = this.brandShow.customer_id;
      this.brand.policymaker_id = this.brandShow.policymaker_id;
      this.brand.principal_id = this.brandShow.principal_id;
      this.brand.sales_stage = this.brandShow.sales_stage;
      this.brand.degree_of_importance = this.brandShow.degree_of_importance;
      this.brand.plan_cooperation_date = this.brandShow.plan_cooperation_date?moment(this.brandShow.plan_cooperation_date.time).format("YYYY-MM-DD HH:MM:SS"):'',
      this.brand.last_follow_up_date = this.brandShow.last_follow_up_date?moment(this.brandShow.last_follow_up_date.time).format("YYYY-MM-DD HH:MM:SS"):'',
      this.brand.estimated_amount = this.brandShow.estimated_amount;
      this.brand.brand_plan_code = this.brandShow.brand_plan_code;
      this.brand.customer_name = this.brandShow.customer_name;
      this.brand.principal_name = this.brandShow.principal_name;
    },

    //提交修改合作品牌数据信息
    dialogedit : function(){
      var id = this.brandShow.id;
      var url = this.https+'/crm/cbCooperation/updateData'; 
      var labelurl = this.https+'/crm/cbCooperation/getList';
      var urlshow = this.https+'/crm/cbCooperation/getDataById';
      //新增页面表单数据提交
      let para = {
        dataJson : JSON.stringify(this.$options.methods.brandPrimsData.bind(this)())
      };
      if(para.dataJson != undefined){
        this.$http.post(url,para,{emulateJSON: true}).then((res) => {  //.then() 返回成功的数据
          if(res.data.status == "success"){
            this.$message('修改品牌合作机会成功');
            //调用列表接口
            this.$options.methods.getData.bind(this)(labelurl,this.$options.methods.primsData.bind(this)(),1, 10);
            this.$options.methods.brandbackData.bind(this)(urlshow,id);
            this.$options.methods.closeDialog.bind(this)();//清空数据
            this.dialogCostoms=false;
          }else{
            this.$message('修改品牌合作机会失败');
          }
          
        })
        .catch(function(res) {
          this.$message('创建品牌合作机会失败');
        }) 
      }
    },

    //清除数据
    closeDialog : function(){
      this.brand.id = '';
      this.brand.brand_name = '';
      this.brand.brand_plan_code = '';
      this.brand.customer_id = '';
      this.brand.policymaker_id = '';
      this.brand.principal_id = '';
      this.brand.sales_stage = '';
      this.brand.degree_of_importance = '';
      this.brand.plan_cooperation_date = '';
      this.brand.last_follow_up_date = '';
      this.brand.estimated_amount = '';
    },

    //修改销售阶段
    updatesale : function(data){
      alert(data);
    },

    //请求品牌合作机会回写
    brandbackData : function(url,id){
      this.$http.get(url,{params:{"id" : id}}).then((res) => {  //.then() 返回成功的数据
        this.brandShow = res.data.data;
        var followurl = this.https+'/crm/followRecords/getList';
        this.$options.methods.followgetData.bind(this)(followurl,this.brandShow.customer_id);
        this.$options.methods.policymaker.bind(this)(this.brandShow.customer_id);
      })
      .catch(function(res) {
          console.log(res)
      }) 
    },

    //删除品牌合作机会的数据
    deleteBrand : function(id){
      this.$confirm('此操作将删除此品牌合作机会, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var url = this.https+'/crm/cbCooperation/delData';
        var labelurl = this.https+'/crm/cbCooperation/getList';
        this.$http.post(url,{"id":id},{emulateJSON: true}).then((res) => {  //.then() 返回成功的数据
          if(res.data.status == "success"){
            this.$message('删除数据成功');
            $('.detail-bg').hide();
            $('.detail').hide();
            this.$options.methods.getData.bind(this)(labelurl,this.$options.methods.primsData.bind(this)(),1, 10);
          }else{
            this.$message('删除数据失败');
          }
         
        }).catch(function(res) {
            console.log(res)
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      }); 
    },

    //选项卡展示
    handleClick(tab, event) {
      var id = this.brandShow.customer_id;
      console.log(tab.name);
      //请求数据信息，更具tab的信息
      if(tab.name == 'first'){
        var followurl = this.https+'/crm/followRecords/getList';
        this.$options.methods.followgetData.bind(this)(followurl,id);
      }
    },

    //修改销售阶段的背景色
    color : function(data){
      var sale = this.brandShow.sales_stage;
      var crmssale = this.crmssaleChance.length;
      var cont = 0;
      if(data == sale){
        return data;
      }else{
        return data;
      }
    },

    //修改销售机会
    upChance : function(id,sales_stage){
      this.upChanceData.id = id;
      this.upChanceData.sales_stage = sales_stage;
      var para = {
        dataJson : JSON.stringify(this.upChanceData)
      }
      this.$confirm('您确认要修改销售阶段吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var id = this.brandShow.id;
        var url = this.https+'/crm/cbCooperation/updateData'; 
        var labelurl = this.https+'/crm/cbCooperation/getList';
        var urlshow = this.https+'/crm/cbCooperation/getDataById';

        this.$http.post(url,para,{emulateJSON: true}).then((res) => {  //.then() 返回成功的数据
          if(res.data.status == "success"){
            this.$message('修改品牌合作机会成功');
            //调用列表接口
            this.$options.methods.getData.bind(this)(labelurl,this.$options.methods.primsData.bind(this)(),1, 10);
            this.$options.methods.brandbackData.bind(this)(urlshow,id);
            this.$options.methods.closeDialog.bind(this)();//清空数据
            this.dialogbrand=false;
          }else{
            this.$message('修改品牌合作机会失败');
          }
        
        })
        .catch(function(res) {
          this.$message('创建品牌合作机会失败');
        }) 
        
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      }); 
    },

    //跟进记录
    followgetData : function(url,id){
      let para = {
        pageSize: -1,
        paramsJson : JSON.stringify({"a.customer_id":"='"+id+"'","a.follow_up_plan":"='"+this.brandShow.id+"'"})
      };
      this.$http.post(url,para,{emulateJSON: true}).then((res) => {  //.then() 返回成功的数据
        this.followData = res.data.data.result;
      })
      .catch(function(res) {
          console.log(res)
      }) 
    },

    //请求合作品牌数据
    brandgetData:function(url,id){
      var data = {
        "a.customer_id": "='"+id+"'"
      }
      var para = {
        pageSize: -1,
        paramsJson : JSON.stringify(data)
      };
      this.$http.post(url,para,{emulateJSON: true}).then((res) => {  //.then() 返回成功的数据
        this.branddata = res.data.data.result;
      })
      .catch(function(res) {
          console.log(res)
      }) 
    },

    /**
     * 品牌合作机会中跟进记录相关操作 
    */    
   
    //整合提交跟进记录信息
    followPrimse(){
      var customer_id = this.brandShow.customer_id?this.brandShow.customer_id:'', //客户id
          contacts_id = this.brandShow.policymaker_id?this.brandShow.policymaker_id:'', //联系人id
          follow_up_way = this.records.follow_up_way?this.records.follow_up_way:'', //跟进方式
          follow_up_plan = this.brandShow.id, //跟进计划品牌机会ID
          follow_up_on_date = this.records.follow_up_on_date?this.records.follow_up_on_date:'', //跟进时间
          leader_instructions = this.records.leader_instructions?this.records.leader_instructions:'',  //领导批示
          remark = this.records.remark?this.records.remark:'',  //跟进备注
          customer_name = '', //客户名称
          contacts_name = this.brandShow.policymaker?this.brandShow.policymaker:''; //联系人名称
      
      //判断客户名称
      if(customer_id){
        for(var i=0; i<this.clientDetail.length;i++){
          if(customer_id == this.clientDetail[i].id){
              customer_name = this.clientDetail[i].name;
          }
        }
      }

      //判断联系人名称
      if(contacts_id){
        for(var i=0; i<this.customerDetail.length;i++){
          if(contacts_id == this.customerDetail[i].id){
            contacts_name = this.customerDetail[i].name;
          }
        }
      }
      
      //数据整合
      var data = {
          customer_id : customer_id, //客户id
          contacts_id : contacts_id, //联系人id
          follow_up_way : follow_up_way, //跟进方式
          follow_up_plan : follow_up_plan, //跟进计划品牌机会ID
          follow_up_on_date : moment(follow_up_on_date.time).format("YYYY-MM-DD HH:mm:ss"), //跟进时间
          leader_instructions : leader_instructions,  //领导批示
          remark : remark,  //跟进备注
          customer_name : customer_name, //客户名称
          contacts_name : contacts_name //联系人名称
      };
      if(customer_id!='' && contacts_id != '' && follow_up_way != '' && follow_up_on_date!=''){
        return data;
      }else{
        //判断客户不能为空
        if(customer_id == ''){
          this.$message('客户不能为空');
        }

        //判断联系人不能为空
        if(contacts_id == ''){
          this.$message('当前品牌机会的决策人为空,请修改决策人信息');
        }

        //判断跟进方式不能为空
        if(follow_up_way == ''){
          this.$message('跟进方式不能为空');
        }

        //判断跟进时间不能为空
        if(follow_up_on_date == ''){
          this.$message('跟进时间不能为空');
        }
      }
    },

    //添加跟进记录
    addfollow : function(){
      var url = this.https+'/crm/followRecords/insertData';
      let para = {
        dataJson : JSON.stringify(this.$options.methods.followPrimse.bind(this)())
      };

      //判断false
      if(para.dataJson != undefined){
        this.$http.post(url,para,{emulateJSON: true}).then((res) => {  //.then() 返回成功的数据
          if(res.data.status == "success"){
            this.$message('新增跟进记录成功');
            var followurl = this.https+'/crm/followRecords/getList';
            this.$options.methods.followgetData.bind(this)(followurl,this.brandShow.customer_id);
            this.$options.methods.closeFollow.bind(this)();//清空数据
          }else{
            this.$message('新增跟进记录失败');
          }
        
        })
        .catch(function(res) {
          this.$message('新增跟进记录失败');
        });
      }
    },

    //清除跟进记录数据
    closeFollow : function(){
      this.records.customer_id = '';
      this.records.follow_up_way = '';
      this.records.follow_up_play = '';
      this.records.follow_up_on_date = '';
      this.records. leader_instructions= '';
      this.records. remark = '';
    },

    //展示评论信息
    showToggle:function(index,id){
      $('.followData').eq(index).find('.followInfo').toggle();
      var url = this.https+'/crm/comment/getList';
      this.$options.methods.showComment.bind(this)(url,id,'跟进记录');//局部刷新评论信息
    },

    //评论数据展示
    commentPrimse : function(){
      var theme_id =  this.textarea.theme_id,
        type = this.textarea.type,
        context = this.textarea.context;
      var data = {
        theme_id : theme_id,
        type : type,
        context : context
      }
      //判断评论内容不为空
      if(context == ''){
        this.$message('请填写评论内容');
      }else{
        return data;
      }
    },
    //添加评论
    comment : function(id){
      var url = this.https+'/crm/comment/insertData';
      this.textarea.theme_id = id;   //获取跟进记录的id
      let para = {
        dataJson : JSON.stringify(this.$options.methods.commentPrimse.bind(this)())
      };
        
      if(para.dataJson != undefined){
        this.$http.post(url,para,{emulateJSON: true}).then((res) => {  //.then() 返回成功的数据
          this.$message('添加评论成功');
          this.$options.methods.closecomment.bind(this)();
          //调用列表接口
          var url = this.https+'/crm/comment/getList';
          this.$options.methods.showComment.bind(this)(url,id,'跟进记录');//局部刷新评论信息
        })
        .catch(function(res) {
          this.$message('添加评论失败');
        });
      }
    },

    //展示评论信息
    showComment : function(url,theme_id,type){
      var data = {
        "a.theme_id" : "='"+theme_id+"'",
        "a.type":"='"+type+"'"
      };
      var para = {
        pageSize : '-1',
        paramsJson : JSON.stringify(data)
      };
      this.$http.post(url,para,{emulateJSON: true}).then((res) => {  //.then() 返回成功的数据
        //调用列表接口
        this.commentInfo = res.data.data.result;
      })
      .catch(function(res) {
        this.$message('请求失败');
      });
    },

    //评论数据清空
    closecomment : function(){
      this.textarea.id = '';
      this.textarea.context = '';
    },
  },
});