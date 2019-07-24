//import http
var http = require('http')
//import cheerio
var cheerio = require('cheerio')
//inport fs
var fs = require('fs')

var base_url = 'http://www.qiuxuebao.com/api/school_detailV2?id='

var urlList = [];

var fetchSchoolArray = []

for ( let i = 2001; i <= 2663; i++) {
    urlList.push(base_url + i)
}


urlList.forEach(function(url){
    fetchSchoolArray.push(getUrlAsync(url))
})

function getUrlAsync(url){
    return new Promise(function(resolve,reject){
        console.log('正在爬取：'+url)
        http.get(url,function(res){
            var html = ''
            res.on('data',function(data){
                html += data
            })

            res.on('end',function(){
                var fileStr = ''
                var schoolData = fetchSchoolData(html)
                fileStr += printSchoolInfo(schoolData)
                var filename = (url.split('id='))[1] + '.txt'
                filename = 'data/' + filename
                fs.writeFile(filename, fileStr, function (err) {
                    if (err) throw err ;
                    console.log("File Saved !"); //文件被保存
                })
            })
        }).on('error',function(){
            reject(e)
            console.log('获取数据出错')
        })
    })
}

function fetchSchoolData(html){
    var $ = cheerio.load(html)
    var schoolData = {}
    var schoolName = $('.name h5').text().trim()
    var schoolPos = $('.name span').text().trim()
    var schoolAddress = $('.school-address').text().trim()
    var schoolDescription =  $('#detail #wholeRemark').text().trim()
    var schoolFee = $('#detail .summary-cont').eq(1).text().trim()
    var schoolLive = $('#detail .summary-cont').eq(2).text().trim()
    var schoolTag = ''
    $('.school-tag .span-flag').each(function() {
        schoolTag += $(this).text().trim() + ','
    })
    schoolData.schoolName = schoolName
    schoolData.schoolPos = schoolPos
    schoolData.schoolAdd = schoolAddress
    schoolData.schoolDescription = schoolDescription
    schoolData.schoolFee = schoolFee
    schoolData.schoolLive = schoolLive
    schoolData.schoolTag = schoolTag
    return schoolData
}

//打印每个页面的信息
function printSchoolInfo(schoolData){
    var fileStr = ""
    fileStr+="---学校名 ：  "+schoolData.schoolName+"----\n"
    fileStr+="省市 ：  "+schoolData.schoolPos+"\n"
    fileStr+="地址 ：  "+schoolData.schoolAdd+"\n\n"
    fileStr+="---介绍---\n   "+schoolData.schoolDescription+"\n\n"
    fileStr+="---学费---\n   "+schoolData.schoolFee+"\n\n"
    fileStr+="---其他---\n   "+schoolData.schoolLive+"\n\n"
    fileStr+="---分类---\n   "+schoolData.schoolTag+"\n"
    return fileStr
}

 //执行promise
Promise.all(fetchSchoolArray)
 .then(function(school){
    //  var fileStr=""
    //  school.forEach(function(html){
    //      var schoolData = fetchSchoolData(html)
    //      fileStr += printSchoolInfo(schoolData)
    //  })
     console.log('fileStr', fileStr)
    //  //写入文件
    //  fs.writeFile("school.doc",fileStr,function (err) {
    //      if (err) throw err ;
    //      console.log("File Saved !"); //文件被保存
    //  })
 })

