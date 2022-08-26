import Swiper from './assets/js/swiper.js'
import Common from './components/Common.vue'

export default {
  components: {
    Common
  },
  data(){
    return{
      // ajax
      site: '',
      all: '',
      store: '',
      footer_community: '',
      copyRight: '',
      customerService: '',

      api: '',
      protocol: '',

      // allProducts, cateory
      // res
      category_product: '',

      // homePage
      // res
      homePage: '',
      swiper: '',
      totalpage_num: 0,

      // search_page
      search_totalpage_num: 0,
      sortBy_arr: [ '商品排序', '上架時間: 由新至舊', '上架時間: 由舊至新', '價格: 由高至低', '價格: 由低至高'],
      sortBy_index: 0,
      perpage_num_arr: [ 6, 9, 12, 15],
      // query
      search_title: '',
      // res
      search: '',

      // homePage, search_page
      perpage_num: 8,
      product_page_active: 1,

      // rich location.href
      rich_id: 0,
      // rich_cid 0: navbar, 1: 關於我們, 2: 顧客服務
      rich_cid: 0,

      // contact
      // res
      contact: '',

      // order
      order_mail: '',
      order_name: '',
      order_phone: '',
      
      order: '',
      product_active: '',

      payStatus_arr: [
        '', '付款成功', '待付款', '已退款', '待對帳'
      ],
      delivery_arr: [
        '', '已出貨', '待付款', '已退貨', '已取消'
      ],

      order_page_number: 0,
      order_page_index: 1,
      order_page_size: 10,
      select_active: false,

      is_payModal: false,
      payModal_message: '',
      
      bank: '',
      bank_code: '',
      bank_account: '',

      order_number: '',
      account_number: '',

      // 
      status_500_counter: 0,
    }
  },
  computed:{
    // homePage 
    // Ex[i].Link 有可能是 websubcategory[j].ID 或 OutUrl
    // direct_link
    filter_ex(){
      let arr = [];
      let Ex = this.homePage.Ex;
      for(let i = 0; i < Ex.length; i++){
        if(Ex[i].type == 0){
          Ex[i].direct_link = Ex[i].Link;
          arr.push(Ex[i]);
        }
        else {
          let websubcategory = this.all.websubcategory;
          for(let j = 0; j < websubcategory.length; j++){
            if( Ex[i].Link == websubcategory[j].ID){

              if(websubcategory[j].Class == 3){
                Ex[i].direct_link = `/rich.html?id=${websubcategory[j].CategoryID}&cid=1`;
              }
              else if(websubcategory[j].Class == 2){
                Ex[i].direct_link = `/rich.html?id=${Ex[i].Link}&cid=0`;
              }
              else if(websubcategory[j].Class == 1){
                Ex[i].direct_link = `/category.html?id=${Ex[i].Link}`;
              }
              else if(websubcategory[j].Class == 0){
                Ex[i].direct_link = `/allProducts.html?id=${Ex[i].Link}`;
              }

              arr.push(Ex[i]);
              break;
            }
          }
        }
      }
      return arr;
    },
    filter_category(){
      let arr = [];
      let Category = this.homePage.Category;
      let websubcategory = this.all.websubcategory;
      for(let i = 0; i < Category.length; i++){
        if(Category[i].Link == 0){
          arr.push(Category[i]);
          continue;
        }
        for(let j = 0; j < websubcategory.length; j++){
          if( Category[i].Link == websubcategory[j].ID){
            if(websubcategory[j].Class == 3){
              Category[i].direct_link = `/rich.html?id=${websubcategory[j].CategoryID}&cid=1`;
            }
            else if(websubcategory[j].Class == 2){
              Category[i].direct_link = `/rich.html?id=${Category[i].Link}&cid=0`;
            }
            else if(websubcategory[j].Class == 1){
              Category[i].direct_link = `/category.html?id=${Category[i].Link}`;
            }
            else if(websubcategory[j].Class == 0){
              Category[i].direct_link = `/allProducts.html?id=${Category[i].Link}`;
            }

            arr.push(Category[i]);
            break;
          }
        }
      }
      return arr;
    },

    // rich
    customize_obj(){
      let object = {};
      if(!this.all){
        return
      }
      for(let i = 0; i < this.all.webcategory.length; i++){
        // all.webcategory[i].Class 0: 無, 1: contact.html, 2: url, 3: customize
        object[this.all.webcategory[i].ID] = this.all.webcategory[i];
      }
      return object;
    },
    navbar_obj(){
      let object = {};
      if(!this.all){
        return
      }
      for(let i = 0; i < this.all.websubcategory.length; i++){
        // all.websubcategory[i].Class 0: all, 1: category, 2: rich, 3: rich(footer)
        if(this.all.websubcategory[i].Class == 2){
          object[this.all.websubcategory[i].ID] = this.all.websubcategory[i];
        }
      }
      return object;
    },
    footer_obj(){
      let object = {};
      if(!this.all){
        return
      }
      for(let i = 0; i < this.all.footer.length; i++){
        object[this.all.footer[i].ID] = this.all.footer[i];
      }
      return object;
    },
  },
  methods: {
    // all
    login(func, arr){
      this.site = JSON.parse(localStorage.getItem('site')) || [] ;

      let formData = new FormData();
      formData.append("site", this.site.Site);
      formData.append("store", this.site.Name);
      formData.append("preview", this.site.Preview);
      formData.append("WebPreview", this.site.WebPreview);

      let xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.open('POST',`${this.protocol}//${this.api}/interface/web/UserLogin`, true);
      xhr.send(formData);
      xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          if(func){
            if(arr){
              func(...arr);
            }
            else {
              func();
            }
          }
        }
      }
    },

    getSite(){
      const vm = this;

      localStorage.setItem('isGetSite', false);
      let xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.open('get',`${vm.protocol}//${vm.api}/interface/web/GetSite`, true);
      xhr.send(null);
      xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          if(JSON.parse(xhr.response).errormessage){
            vm.login(vm.getSite);
            return;
          }

          localStorage.setItem('isGetSite', true);

          vm.site = JSON.parse(xhr.response).data[0];

          if(vm.site.WebEnable == 0){
            vm.urlPush('/error.html');
            return
          } 

          localStorage.setItem('site', JSON.stringify(vm.site));

          vm.getAll();
          vm.getStore();
          vm.getCopyRight();
          vm.getCustomerService();

          let pathname = location.pathname;

          // homePage
          if( pathname === '/' || pathname === '/index.html'){
            vm.getHomePage();
          }
          
          // allProducts, category
          if( pathname == '/allProducts.html' ||
              pathname === '/category.html'){

            let search = location.href.split('?')[1] || '';
            let arr = search.split('&') ;
          
            for(let i = 0; i < arr.length; i++){
              if( arr[i].split('=')[0] == 'id' ){
                vm.getCategory(arr[i].split('=')[1]);
              }
            }
          }

          // rich
          if( pathname === '/rich.html'){
            let search = location.href.split('?')[1] || '';
            let arr = search.split('&') ;

            for(let i = 0; i < arr.length; i++){
              if( arr[i].split('=')[0] == 'id' ){
                vm.rich_id = arr[i].split('=')[1];
              }
              else if( arr[i].split('=')[0] == 'cid' ){
                vm.rich_cid = arr[i].split('=')[1];
              }
            }
          }

          // contact
          if( pathname === '/contact.html'){
            vm.getContact();
          }

          // search
          if( pathname === '/search.html'){
            if(location.href.indexOf('?query=') != -1){
              vm.getSearch();
            }
          }
        }
        else if(this.status == 500){
          if(vm.status_500_counter < 3){
            vm.status_500_counter++;
            vm.login(vm.getSite);
          }
        }
      }
    },

    getAll(){
      let vm = this;

      let site_webPreview = (JSON.parse(localStorage.getItem('site')).WebPreview || '') ;

      let formData = new FormData();
      formData.append("WebPreview", site_webPreview);

      let xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.open('post',`${vm.protocol}//${vm.api}/interface/web/WebLogin`, true);
      xhr.send(formData);
      xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          // if(JSON.parse(xhr.response).errormessage){
          //   vm.login(vm.getAll);
          //   return;
          // }

          vm.all = JSON.parse(xhr.response);
          vm.totalpage_num = Math.ceil(vm.all.data.length / vm.perpage_num);
          
          // webcategory, websubcategory => navbar
          let webcategory = vm.all.webcategory;
          let websubcategory = vm.all.websubcategory;
          let navbar = [];

          // => webcategory[i] => navbar
          for(let i = 0; i < webcategory.length; i++){
            let link;
            // webcategory[i].Class 0: all category rich, 1: contact, 2: 外部連結, 3: 自訂義
            switch(webcategory[i].Class) {
              case '1':
                link = '/contact.html';
                break;
              case '2':
                link = webcategory[i].Text;
                break;
              case '3':
                link = `/rich.html?id=${webcategory[i].ID}&cid=3`;
                break;
            }
            webcategory[i].Link = link;
            webcategory[i].isDropDown = false;
            navbar.push(webcategory[i]);
          }

          // => websubcategory[i] => navbar[i].subNavbar
          for(let i = 0; i < websubcategory.length; i++){
            let link;
            // websubcategory[i].Class 0: all, 1: category, 2: rich, 3: rich(footer)
            if(websubcategory[i].Class == 3){
              link = `/rich.html?id=${websubcategory[i].CategoryID}&cid=1`;
            }
            else if(websubcategory[i].Class == 2){
              link = `/rich.html?id=${websubcategory[i].ID}&cid=0`;
            }
            else if(websubcategory[i].Class == 1){
              link = `/category.html?id=${websubcategory[i].ID}`;
            }
            else if(websubcategory[i].Class == 0){
              link = `/allProducts.html?id=${websubcategory[i].ID}`;
            }

            // subNavbar 放 navbar[?]
            for( let j = 0; j < navbar.length; j++){
              if(websubcategory[i].Category == navbar[j].ID){
                if(!navbar[j].subNavbar){
                  navbar[j].subNavbar = [];
                }
                websubcategory[i].Link = link;
                webcategory[j].subNavbar.push(websubcategory[i]);
              }
            }
          }
          vm.all.Navbar = navbar;

          // footer => about, client
          let footer = vm.all.footer;
          vm.all.about = [];
          vm.all.client = [];
          let about = vm.all.about;
          let client = vm.all.client;

          for(let i = 0; i < footer.length; i++){            
            if(footer[i].CID == 1){
              footer[i].Link = `/rich.html?id=${footer[i].ID}&cid=1`;
              about.push(footer[i]);
            }
            else if(footer[i].CID == 2){
              footer[i].Link = `/rich.html?id=${footer[i].ID}&cid=2`;
              client.push(footer[i]);
            }
          }
        }
      }
    },
    getStore(){
      let vm = this;

      let site_webPreview = (JSON.parse(localStorage.getItem('site')).WebPreview || '') ;

      let formData = new FormData();
      formData.append("WebPreview", site_webPreview);

      let xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.open('post',`${vm.protocol}//${vm.api}/interface/web/getStore`,true);
      xhr.send(formData);
      xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          // if(JSON.parse(xhr.response).errormessage){
          //   vm.login(vm.getStore);
          //   return;
          // }

          vm.store = JSON.parse(xhr.response).data[0];
          let title = vm.store.Name;

          // 新增 store.footer 放聯絡我們 icon 
          // 有 link 才顯示
          vm.footer_community = JSON.parse(xhr.response).footer[0];

          // GA
          let GAText = vm.store.GA;
          vm.appendScript(GAText, 'head');

          if(vm.site.WebPreview == 1){
            document.title = title;
          }
          else if(vm.site.WebPreview == 2){
            document.title = title + ' (預覽模式)';
          }
        }
      }
    },
    getCopyRight(){
      const vm = this;

      let site_webPreview = (JSON.parse(localStorage.getItem('site')).WebPreview || '') ;
      let formData = new FormData();
      formData.append("WebPreview", site_webPreview);


      let xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.open('post',`${vm.protocol}//${vm.api}/interface/web/GetCopyRight`, true);
      xhr.send(formData);
      xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          // if(JSON.parse(xhr.response).errormessage){
          //   vm.login(vm.getSite);
          //   return;
          // }
          if(JSON.parse(xhr.response).data.length){
            vm.copyRight = JSON.parse(xhr.response).data[0];
          }
        }
      }
    },
    getCustomerService(){
      const vm = this;

      let site_webPreview = (JSON.parse(localStorage.getItem('site')).WebPreview || '') ;

      let formData = new FormData();
      formData.append("WebPreview", site_webPreview);

      let xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.open('post',`${vm.protocol}//${vm.api}/interface/web/GetCustomerService`, true);
      xhr.send(formData);
      xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          // if(JSON.parse(xhr.response).errormessage){
          //   vm.login(vm.getSite);
          //   return;
          // }
          let data = JSON.parse(xhr.response).data;
          if( !data.length || !data[0].Text){
            return;
          }

          vm.customerService = data[0];
          vm.customerService.Type == 1 ? vm.appendScript(vm.customerService.Text, 'head'): vm.appendScript(vm.customerService.Text, 'body');
        }
      }
    },
    appendScript(text, tag){
      if(!text){
        return
      }

      // 
      let script_arr = [];

      let scriptItems = text.split('&lt;script');
      scriptItems.splice(0, 1);

      for(let i = 0; i < scriptItems.length; i++){
        scriptItems[i] = '&lt;script '+ scriptItems[i].trim();
        let attr = scriptItems[i].split('&gt;')[0];

        let content = scriptItems[i].split('&gt;')[1].split("&lt;/script")[0];
        let arr = attr.split(" ");
        let obj = {};
        for(let i = 0; i < arr.length; i++){
          if(arr[i].indexOf('="') != -1){
            obj[arr[i].split('="')[0]] = arr[i].split('="')[1].split('"')[0];
          } 
        }

        let script = document.createElement('script');
        for(let item in obj){
          script.setAttribute(item, obj[item]);
        }
        script.textContent = content;

        script_arr.push(script);
      }

      // 
      for(let i = 0; i < script_arr.length; i++){
        document.querySelector(tag).appendChild(script_arr[i])
      }
    },

    // single
    getHomePage() {

      let vm = this;

      let site_webPreview = (JSON.parse(localStorage.getItem('site')).WebPreview || '') ;

      let formData = new FormData();
      formData.append("WebPreview", site_webPreview);

      let xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.open('post', `${vm.protocol}//${vm.api}/interface/web/GetHomePage`, true);
      xhr.send(formData);
      xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          // if(JSON.parse(xhr.response).errormessage){
          //   vm.login(vm.getHomePage);
          //   return;
          // }

          let data = JSON.parse(xhr.response).data[0];
          let Ad = JSON.parse(xhr.response).Advertise;
          for(let i = Ad.length - 1; i >= 0; i--){
            if(!Ad[i].URL){
              Ad.splice(i, 1)
            }
          }

          if(!data){
            return;
          }

          // Ex[i].Link: data.Type1 > 0 ? data.Type1 : data.OutUrl1
          let dataSort = {
            TopImg: data.TopImg,
            PhoneImg: data.PhoneImg,
            Ex: [
              { Img: data.ExImg1, Link: data.Type1 > 0 ? data.Type1 : data.OutUrl1, type: data.Type1},
              { Img: data.ExImg2, Link: data.Type2 > 0 ? data.Type2 : data.OutUrl2, type: data.Type2},
            ],
            Category: [
              { Img: data.Img1, Link: data.Link1 },
              { Img: data.Img2, Link: data.Link2 },
              { Img: data.Img3, Link: data.Link3 },
              { Img: data.Img4, Link: data.Link4 },
              { Img: data.Img5, Link: data.Link5 },
              { Img: data.Img6, Link: data.Link6 },
            ],
            Community: {
              FB: { Img: data.FBImg, Link: data.FBLink },
              Line: { Img: data.LineImg, Link: data.LineLink },
              IG: { Img: data.IGImg, Link: data.IGLink },
            }
          }

          length = dataSort.Ex.length;
          // Ex filter !img
          for (let i = length - 1; i > -1; i--) {
            if (!dataSort.Ex[i].Img) {
              dataSort.Ex.splice(i, 1);
            }
          }
          length = dataSort.Category.length;
          // Category filter !img
          for (let i = length - 1; i > -1; i--) {
            if (!dataSort.Category[i].Img) {
              dataSort.Category.splice(i, 1);
            }
          }

          dataSort.Ad = Ad;
          vm.homePage = dataSort;

          vm.$forceUpdate();

          setTimeout(function () {
            vm.swiper = new Swiper('.swiper-container', {
              slidesPerView: 'auto',
              spaceBetween: 0,

              autoplay: {
                delay: 5000,
                disableOnInteraction: false,
              },

              loop: true,

              observer: true,
              observeParents: true,

              centeredSlides: true,

              pagination: {
                el: '.swiper-pagination',
                clickable: true,
              },
            });
          }, 100);
        }
      }
    },
    getCategory(id) {
      let vm = this;

      let site_webPreview = (JSON.parse(localStorage.getItem('site')).WebPreview || '') ;

      let formData = new FormData();
      formData.append("id", id);
      formData.append("WebPreview", site_webPreview);

      let xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.open('post', `${vm.protocol}//${vm.api}/interface/web/GetWebSubCategory`, true);
      xhr.send(formData);
      xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          // if(JSON.parse(xhr.response).errormessage){
          //   vm.login(vm.getCategory, [id]);
          //   return;
          // }

          vm.category_product = JSON.parse(xhr.response);
          
          vm.category_product.Sort = {};
          let sort = vm.category_product.Sort;
          let data = vm.category_product.Data[0];
          let category = vm.category_product.Category;
          let product = vm.category_product.Product;
          
          // category => sort[i]
          for (let i = 0; i < category.length; i++) {
            sort[category[i].ID] = {};
            sort[category[i].ID].Products = {};
            sort[category[i].ID].Name = category[i].Name;
          }

          // product => sort[i].Products[j]
          for (let i = 0; i < product.length; i++) {
            // Category1~5
            for (let j = 1; j < 6; j++) {
              let category_item = product[i][`Category${j}`];
              if (category_item) {
                if (sort[category_item]) {
                  sort[category_item].Products[product[i].ID] = product[i];
                }
              }
            }
          }

          data.Img = [];
          for(let i = 1; i < 6; i++){
            if(data[`Img${i}`]){
              data.Img.push(data[`Img${i}`]);
            }
          }

          vm.$forceUpdate();
        }
      }
    },
    getContact() {
      let vm = this;

      let site_webPreview = (JSON.parse(localStorage.getItem('site')).WebPreview || '') ;
      let formData = new FormData();
      formData.append("WebPreview", site_webPreview);

      let xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.open('post', `${vm.protocol}//${vm.api}/interface/web/GetWebContact`, true);
      xhr.send(formData);
      xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          // if(JSON.parse(xhr.response).errormessage){
          //   vm.login(vm.getContact);
          //   return;
          // }
          
          vm.contact = JSON.parse(xhr.response).data[0];

          vm.$forceUpdate();
        }
      }
    },
    // index:string
    getSearch(index) {
      let vm = this;

      let site_webPreview = (JSON.parse(localStorage.getItem('site')).WebPreview || '') ;
      if(index){
        vm.sortBy_index = index * 1;
      }
      else{
        let search = location.href.split('?')[1] || '';
        let arr = search.split('&') ;

        for(let i = 0; i < arr.length; i++){
          if( arr[i].split('=')[0] == 'query' ){
            vm.search_title = decodeURI( arr[i].split('=')[1] );
          } 
          else if( arr[i].split('=')[0] == 'type' ){
            vm.sortBy_index = arr[i].split('=')[1];
          }
        }
      }

      let formData = new FormData();
      formData.append("input", vm.search_title);
      formData.append("type", vm.sortBy_index);

      formData.append("WebPreview", site_webPreview);

      let xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.open('post', `${vm.protocol}//${vm.api}/interface/web/GetProductSearch`, true);
      xhr.send(formData);
      xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          if(JSON.parse(xhr.response).errormessage){
            vm.login(vm.getSearch);
            return;
          }

          vm.search = JSON.parse(xhr.response).data;
          vm.perpage_num =  6;
          vm.search_totalpage_num = Math.ceil(vm.search.length / vm.perpage_num);
          vm.product_page_active = 1;

          vm.$forceUpdate();
        }
      }
    },

    // order
    getOrder(){
      if(!this.order_mail || !this.order_name || !this.order_phone){
        this.payModal_message = '請填寫搜尋條件';
        this.is_payModal = true;
        this.order = null;
        return
      }

      let vm = this;

      let formData = new FormData();
      formData.append("mail", this.order_mail.trim());
      formData.append("name", this.order_name.trim());
      formData.append("phone", this.order_phone.trim());

      formData.append("pageindex", this.order_page_index);
      formData.append("pagesize", this.order_page_size);

      formData.append("Store", this.site.Store);
      formData.append("Site", this.site.Site);

      let xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.open('post', `${vm.protocol}//${vm.api}/interface/web/GetOrderContactAjax`, true);
      xhr.send(formData);
      xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          if(JSON.parse(xhr.response).errormessage){
            vm.login(vm.getOrder);
            return;
          }

          vm.order = JSON.parse(xhr.response).Orders;
          vm.order_page_number = Math.ceil(JSON.parse(xhr.response).Count / vm.order_page_size);
          vm.bank = require('./assets/bank.json');

          if(vm.order_page_number == 0){
            vm.payModal_message = '查無訂單資料';
            vm.is_payModal = true;
            vm.order = null;
            return;
          }

          console.log(vm.order)

          vm.$nextTick(function(){
            let max_height = parseInt( getComputedStyle( document.querySelector('.td.products') )['maxHeight']);
            let uls = document.querySelectorAll('.td.products ul');
            uls.forEach(function(item, index){
              // vm.$set(vm.order[index],"is_active", false)
              if(item.getBoundingClientRect().height > max_height){
                vm.$set(vm.order[index],"expandable", true)
              }
            })
          })
        }
      }
    },
    copy(text){
      let copy_input = document.querySelector('#copy_input');
      copy_input.value = text;
      copy_input.select();
      document.execCommand('copy');
    },
    filter_account_number(){
      if(this.account_number.length > 6){
        this.account_number = this.account_number.substring(0, 6)
      }
    },
    checkPay(){
      if(!this.order_number || !this.account_number){
        this.payModal_message = '請填寫匯款帳號末6碼';
        this.is_payModal = true;
        return
      }

      let vm = this;

      let formData = new FormData();
      formData.append("payflino", this.order_number);
      formData.append("paytradeno", this.account_number);

      let xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.open('post', `${vm.protocol}//${vm.api}/interface/web/ATMComfirmBack`, true);
      xhr.send(formData);
      xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          if(JSON.parse(xhr.response).errormessage){
            vm.login(vm.getOrder);
            return;
          }
          if(JSON.parse(xhr.response).status){
            vm.payModal_message = '確認付款已送出';
            vm.is_payModal = true;
          } else {
            vm.payModal_message = '確認付款失敗';
            vm.is_payModal = true;
          }

          vm.$forceUpdate();
        }
      }
    },

    // sidebar change all.Navbar[index].isDropDown
    changeDropDown(index){
      this.all.Navbar[index].isDropDown = !this.all.Navbar[index].isDropDown;
      this.$forceUpdate();
    },
    
    // homePage
    pagePush(page){
      if(page > this.totalpage_num || page < 1){
        return;
      }
      this.product_page_active = page;
      this.$forceUpdate();
    },
    
    // allProducts, category, rich, contact(map)
    unescapeHTML(str){
      let vm = this;
      str = "" + str;
      
      this.$nextTick(function () {
        vm.imgHandler();
      });

      return str.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&apos;/g, "'");
    },
    imgHandler(){
      
      let editorWidth = 0;
      let editor_input =  document.querySelector('#EditerWidth');
      if(editor_input){
        editorWidth = editor_input.value  * 1
      }

      let ql_editor = document.querySelector('.ql-editor');

      let rich_container = document.querySelector('.rich_container');

      if(!ql_editor || !rich_container){
        return
      }

      let rich_container_width = parseFloat(window.getComputedStyle(rich_container).width);
      let rich_container_padding = parseFloat(window.getComputedStyle(rich_container).padding);
      if(rich_container_padding){
        rich_container_width -= rich_container_padding*2;
      }

      if( editorWidth < rich_container_width ){
        ql_editor.style.width = editorWidth + 'px';
      } 
      else{
        ql_editor.style.width = rich_container_width + 'px';
      }

      let imgs = document.querySelectorAll('.ql-editor img');
      for(let i = 0; i < imgs.length; i++){
        let imgWidth = window.getComputedStyle(imgs[i]).width.split('px')[0] * 1;

        if(imgWidth > editorWidth){
          imgs[i].style.width = editorWidth + 'px';
        }
      }

      let videos = document.querySelectorAll('.ql-editor .ql-video');
      for(let i = 0; i < videos.length; i++){
        let videosWidth = window.getComputedStyle(videos[i]).width.split('px')[0] * 1;
        if(videosWidth > editorWidth){
          videos[i].style.width = editorWidth + 'px';
        }
      }
    },

    // allProducts, category
    videoHandler(url){
      let code = '';
      if(url.indexOf('youtu.be') != -1){
        code = url.split('https://youtu.be/')[1];
      }
      else if(url.indexOf('www.youtube.com') != -1){
        if(url.split('?v=').length > 1){
          code = url.split('?v=')[1].split('&')[0];
        }
      }
      let iframe = '';
      if(code){
        iframe = `
          <iframe src="https://www.youtube.com/embed/${code}" 
            frameborder="0" 
            allow="accelerometer; 
              autoplay; clipboard-write; 
              encrypted-media; 
              gyroscope; 
              picture-in-picture" 
            allowfullscreen
          >
          </iframe>
        `
      }
      return iframe;
    },

    // urlPush
    urlPush(url, isOpen){
      if(!url){
        return;
      }
      if(isOpen){
        localStorage.setItem('isActiveUser', 1);
        window.open(url);
      }
      else{
        localStorage.setItem('isActiveUser', 1);
        window.location.href = url;
      }
    },
    // homePage allProducts, category, search
    pushTo_cart(id){
      this.site = JSON.parse(localStorage.getItem('site')) || [] ;
      if(this.site.WebPreview == 2){
        alert('預覽模式下不開放');
      }
      else{
        const vm = this;

        if(id === undefined){
          vm.urlPush(`/cart/`, true)
        }
        else{
          vm.urlPush(`/cart/?id=${id}`, true)
        }
      }
    },
  },
  created(){
    let vm = this;
    vm.api = location.host;
    vm.protocol = location.protocol;

    // login
    vm.$bus.$on('login', () => {
      vm.login();
    })
    // sidebar
    vm.$bus.$on('changeDropDown', index => {
      vm.changeDropDown(index)
    })
    // urlPush
    vm.$bus.$on('urlPush', (url, isOpen) => {
      vm.urlPush(url, isOpen);
    })
    vm.$bus.$on('pushTo_cart', id => {
      vm.pushTo_cart(id);
    })
  },
  mounted(){
    this.getSite();
    document.querySelector('body').style['padding-top'] = document.querySelector('.header').getBoundingClientRect().height + 'px';
  }
}