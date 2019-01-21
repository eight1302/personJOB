/** 
 * create author name xiaominzhang
 * create time 2018/8/19
*/
var vue = new Vue({
  el:"#app",
  mounted(){
  },
  data:{
    navdata : [
      {
        "regulate" : "首页",
        "href" : "../../view/index/index.html",
        "fontpig" : "fa fa-home"
      },{
        "regulate" : "客户管理",
        "href" : "../../view/client/client.html",
        "fontpig" : "fa fa-home"
      },{
        "regulate" : "跟进计划",
        "href" : "../../view/clientuser/client.html",
        "fontpig" : "fa fa-home"
      },{
        "regulate" : "地域平均薪资",
        "href" : "../../view/regional/regional.html",
        "fontpig" : "fa fa-user"
       },{
        "regulate" : "管理员",
        "href" : "../../view/enterprise/enterprise.html",
        "fontpig" : "fa fa-user"
       },{
        "regulate" : "日志管理",
        "href" : "../../view/log/log.html",
        "fontpig" : "fa fa-user"
       }
    ],
    height:{height:''},  //详情页统一高度样式
    height1:{height:''},
    tabindex:0,
    
    //页面调整url
    tourl:'../../view/index/index.html'
  },
  created(){
    this.hh(); //获取页面高度
    const that = this
    window.onresize = () => {
        return (() => {
          this.hh();
        })();
    }
  },
  methods:{
    hh(){
      this.height.height=window.innerHeight+'px';
      this.height1.height = window.innerHeight-70+'px'
    },
    gourl : function(data){
      this.tourl = data;
    },
    //退出系统
    out : function(){
      this.$message({
        message: '退出成功',
        type: 'success'
      });
      window.location.href = '../../view/login.html';
    }
  }
});
