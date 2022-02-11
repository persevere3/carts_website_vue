function leave(){
  // activePages
  let activePages = localStorage.getItem('activePages') || 0 ;
  +activePages --;
  localStorage.setItem('activePages', activePages);

  if(activePages > 0) {
    return;
  }

  let isGetSite = localStorage.getItem('isGetSite') ;
  let timeAnalysis = JSON.parse(localStorage.getItem('timeAnalysis')) || {} ;
  if(isGetSite){
    timeAnalysis.endTime = new Date().getTime();
    timeAnalysis.stayTime = Math.floor( (timeAnalysis.endTime - timeAnalysis.startTime) / 1000 );
    localStorage.setItem('timeAnalysis', timeAnalysis);
  }
  else { // getSite 失敗 ， 沒有執行 initTimeAnalysis
    return;
  }

  let api = location.host;
  let protocol = location.protocol;
  const url = `${protocol}//${api}/interface/store/ClosePage`;

  // id
  let site = JSON.parse(localStorage.getItem('site')) || {} ;

  // user
  let user = localStorage.getItem('isActiveUser') 
                          ? JSON.parse(localStorage.getItem('isActiveUser'))  
                          : 0;

  // type
  // 失敗率 failureProbabilityType
  let failureProbabilityType = localStorage.getItem('failureProbabilityType') 
                          ? JSON.parse(localStorage.getItem('failureProbabilityType'))  
                          : 0;
  // isShowCartPage false: type0 
  // isShowCartPage true: type1
  // isClickNext true: type2
  // isClickFinishOrder true: type3
  let type;
  switch(failureProbabilityType){
    case 0:
      type = 3;
      break;
    case 1:
      type = 1;
      break;
    case 2:
      type = 2;
      break;
    case 3:
      type = 0;
      break;
  }

  // page
  let page = location.pathname.split('/');
  page = page[1] ? page[1] : "index.html";

  let formData = new FormData();
  formData.append('id', site.Name + '');
  formData.append('stayTime', timeAnalysis.stayTime + '');
  formData.append('user', user);
  formData.append('type', type);
  formData.append('page', page);
  
  let xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.open('POST', url, true);
  xhr.send(formData);
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    }
  }
}