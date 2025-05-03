
# jsoup xóa phần từ
doc.select("#contentdp").remove();

# jsoup lấy attribute
doc.select('meta[property="og:novel:author"]')

doc.select("a").attr("href")

# json sang string

console.log(JSON.stringify(obj))

# string sang json

let obj = JSON.parse(data)

# jsoup lấy phần từ dựa theo text của nó

Lấy href của phần từ có text là 下一页, dùng cho web chia chương to thành chưởng nhỏ chap.js/trang tiếp theo trong gen.js

doc.select("a:contains(下一页)").first().attr("href")


doc.select("person[*=duck]")

# Lấy phần tử theo vị trí

.first()
.get(0)
.last()

# Ký tự đầu, cuối string
	
if(url.slice(-1) === "/")
	url = url.slice(0, -1)

if(url.slice(-1) !== "/")
	url = url + "/";
	
# check substring
	
text.includes("world")

url.indexOf("string") !== -1)

# Lấy chuỗi cuối sau khi split string: domain.com/ahihi/000124 => 000124

let output = input.split(/[/ ]+/).pop()

# Browser

var browser = Engine.newBrowser()
browser.launch(url, 10000)
var doc = browser.html() 
browser.close()


# check length & foreach
		
		
if (data.length === 0) {
	doc.select(".novellist li").forEach(e => {
	
	}); 
}

# Search.js, trường hợp trên trang không thông trang tiêp theo - next 

    if(!page) page = '1';
    let response = fetch('https://'+page);
        var next = parseInt(page, 10) + 1;
        return Response.success(data, next.toString());
    }
    return null;
}
		


# Regex cho home

<li><a href="(.*?)">(.*?)</a></li>
{title: "\2", input:  "\1", script: "gen.js"},

# Regex match string

var data = htm.match(/<script.*?type=\"application\/json\">(.*?)<\/script>/)

var bookid =  url.match(/(\d+)/)[1]


# Regex - chuỗi ký tự, số, 1 ký tự

(.*?)
(\d+)
(.)

# Regex ký tự tiếng Việt


[à|á|ã|ạ|ả|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ|è|é|ẹ|ẻ|ẽ|ê|ề|ế|ể|ễ|ệ|đ|ì|í|ĩ|ỉ|ị|ò|ó|õ|ọ|ỏ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ|ù|ú|ũ|ụ|ủ|ư|ứ|ừ|ử|ữ|ự|ỳ|ỵ|ỷ|ỹ|ý|À|Á|Ã|Ạ|Ả|Ă|Ắ|Ằ|Ẳ|Ẵ|Ặ|Â|Ấ|Ầ|Ẩ|Ẫ|Ậ|È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ể|Ễ|Ệ|Đ|Ì|Í|Ĩ|Ỉ|Ị|Ò|Ó|Õ|Ọ|Ỏ|Ô|Ố|Ồ|Ổ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ở|Ỡ|Ợ|Ù|Ú|Ũ|Ụ|Ủ|Ư|Ứ|Ừ|Ử|Ữ|Ự|Ỳ|Ỵ|Ỷ|Ỹ|Ý]


# Replace

Phần từ đầu

url = url.replace('m.banxia.tv', 'www.banxia.tv')

Toàn bộ

replace(/\n/g, "<br />")



====================================

# HÀNG CHUẨN



# Selector overview
-	tagname: find elements by tag, e.g. a
-	ns|tag: find elements by tag in a namespace, e.g. fb|name finds <fb:name> elements
-	#id: find elements by ID, e.g. #logo
-	.class: find elements by class name, e.g. .masthead
-	[attribute]: elements with attribute, e.g. [href]
-	[^attr]: elements with an attribute name prefix, e.g. [^data-] finds elements with HTML5 dataset attributes
-	[attr=value]: elements with attribute value, e.g. [width=500] (also quotable, like [data-name='launch sequence'])
-	[attr^=value], [attr$=value], [attr*=value]: elements with attributes that start with, end with, or contain the value, e.g. [href*=/path/]
-	[attr~=regex]: elements with attribute values that match the regular expression; e.g. img[src~=(?i)\.(png|jpe?g)]
*: all elements, e.g. *
# Selector combinations
-	el#id: elements with ID, e.g. div#logo
-	el.class: elements with class, e.g. div.masthead
-	el[attr]: elements with attribute, e.g. a[href]
-	Any combination, e.g. a[href].highlight
-	ancestor child: child elements that descend from ancestor, e.g. .body p finds p elements anywhere under a block with class "body"
-	parent > child: child elements that descend directly from parent, e.g. div.content > p finds p elements; and body > * finds the direct children of the body tag
-	siblingA + siblingB: finds sibling B element immediately preceded by sibling A, e.g. div.head + div
-	siblingA ~ siblingX: finds sibling X element preceded by sibling A, e.g. h1 ~ p
-	el, el, el: group multiple selectors, find unique elements that match any of the selectors; e.g. div.masthead, div.logo
# Pseudo selectors
-	:lt(n): find elements whose sibling index (i.e. its position in the DOM tree relative to its parent) is less than n; e.g. td:lt(3)
-	:gt(n): find elements whose sibling index is greater than n; e.g. div p:gt(2)
-	:eq(n): find elements whose sibling index is equal to n; e.g. form input:eq(1)
-	:has(selector): find elements that contain elements matching the selector; e.g. div:has(p)
-	:not(selector): find elements that do not match the selector; e.g. div:not(.logo)
-	:contains(text): find elements that contain the given text. The search is case-insensitive; e.g. p:contains(jsoup)
-	:containsOwn(text): find elements that directly contain the given text
-	:matches(regex): find elements whose text matches the specified regular expression; e.g. div:matches((?i)login)
-	:matchesOwn(regex): find elements whose own text matches the specified regular expression
Note that the above indexed pseudo-selectors are 0-based, that is, the first element is at index 0, the second at 1, etc



=======================================================


# Chap.js chung

function execute(url) {
    url = url.replace('m.banxia.tv', 'www.banxia.tv');
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let htm = doc.select("#content").html();
        htm = htm.replace(/\&nbsp;/g, "");
        return Response.success(htm);
    }
    return null;
}



# Chap.js  web chia chương to thành chưởng nhỏ

function execute(url) {
    url = url.replace('m.banxia.tv', 'www.banxia.tv');
    let cvData ="";
    let part1 = url.replace("http://www.banxia.tv", "").replace("https://www.banxia.tv", "").replace(".html","");
    var next = part1;
    while (next.includes(part1)) {
        let response = fetch("http://www.banxia.tv" + next +".html");
        if (response.ok) {
            let doc = response.html();
            next = doc.select("a#next_url").attr("href").replace(".html","");
            let htm = doc.select("#article").html();
            htm = htm.replace(/\&nbsp;/g, "");
            cvData = cvData + htm;
        } else {
            break;
        }
    }
    if (cvData) {
        return Response.success(cvData);
    }
    return null;
}



# Detail.js chung

function execute(url) {
    url = url.replace('m.banxia.tv', 'www.banxia.tv');
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let coverImg = doc.select(".novel_info_main img").first().attr("src");
        if (coverImg.startsWith("//")) {
            coverImg = "https:" + coverImg;
        }
        let author = doc.select(".novel_info_title i a").first().text().replace(/作\s*者：/g, "");
        return Response.success({
            name: doc.select(".novel_info_title h1").text(),
            cover: coverImg,
            author: author,
            description: doc.select(".intro").html(),
            detail: "作者： " +  author + "<br>" + doc.select(".flex.to100").text(),
            host: "https://www.banxia.tv"
        });
    }
    return null;
}


# toc.js chung


function execute(url) {
	url = url.replace('m.banxia.tv', 'www.banxia.tv');
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let el = doc.select("#list dd a")
        const data = [];
        for (let i = 0;i < el.size(); i++) {
            var e = el.get(i);
            data.push({
                name: e.select("a").text(),
                url: e.attr("href"),
                host: "http://www.banxia.tv"
            })
        }
        return Response.success(data);
    }
    return null;
}

# home.js chung

function execute() {
    return Response.success([
        {title: "首页", input: "http://www.banxia.tv/", script: "gen.js"},
    ]);
}

# gen.js

function execute(url, page) {
    if(!page) page = '1';
    if(url.slice(-1) !== "/")
        url = url + "/";
	url = url.replace('m.banxia.tv', 'www.banxia.tv');
    let response = fetch(url +  page + ".html");
    if (response.ok) {
        let doc = response.html();
        const data = [];
        let next = ""
        next = doc.select("a.next").attr("href").replace(".html","").split(/[/ ]+/).pop();
		doc.select("#newscontent .l li").forEach(e => {
            data.push({
                name: e.select(".s2 a").first().text(),
                link: e.select(".s2 a").first().attr("href"),
                description: e.select(".s3 a").first().text(),
                host: "http://www.banxia.tv"
            })
        });


        return Response.success(data, next);
    }
    return null;
}


# page.js mấy trang phân ttrang mục lục, để mục lục trong select

function execute(url) {
    if(url.slice(-1) !== "/")
        url = url + "/";
    url = url.replace("banxia.tv/","banxia.tv/indexlist/");
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        const data = [];
        let elr1 = doc.select("#indexselect").first().select("option");
        elr1.forEach(e => {
            data.push("https://www.banxia.tv" + e.attr("value"));
        });
        
        return Response.success(data);
    }
    return null;
}

# search gbk, tải tại https://moleys.4everland.store/cdn/gbk.js

function execute(key, page) {
    var gbkEncode = function(s) {
        load('gbk.js');
        return GBK.encode(s);
    }
    var response = fetch("http://www.banxia.tv/modules/article/search.php?searchtype=articlename&searchkey=" +gbkEncode(key));
    if (response.ok) {
        var doc = response.html('gbk');
		var data = [];
		doc.select("table.grid tr#nr").forEach(e => {
            console.log(e)
            data.push({
                name: e.select("td.odd").first().text(),
                link: e.select("a").first().attr("href"),
                description: e.select("td.odd").get(1).text(),
                host: "http://www.banxia.tv"
            })
        });
        return Response.success(data);
    }
    return null;
}

# plugin.json

{
  "metadata": {
    "name": "banxia",
    "author": "Moleys",
    "version": 1,
    "source": "https://www.banxia.tv",
    "regexp": "(www.|m.)?banxia.tv/(bxchapter|bxbooks|bxbook)/\\d+(/?|\\.html)",
    "description": "Đọc truyện trên trang https://www.banxia.tv",
    "locale": "zh_CN",
    "language": "javascript",
    "type": "chinese_novel"
  },
  "script": {
    "home": "home.js",
    "detail": "detail.js",
    "toc": "toc.js",
    "chap": "chap.js"
  }
}



# slugify: 'tôi là ai' => 'toi-la-ai'

function slugify(e){var a="àáäâãåăæąçćčđďèéěėëêęğǵḧìíïîįłḿǹńňñòóöôœøṕŕřßşśšșťțùúüûǘůűūųẃẍÿýźžż·/_,:;",r=new RegExp(a.split("").join("|"),"g");return e.toString().toLowerCase().replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi,"a").replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi,"e").replace(/i|í|ì|ỉ|ĩ|ị/gi,"i").replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi,"o").replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi,"u").replace(/ý|ỳ|ỷ|ỹ|ỵ/gi,"y").replace(/đ/gi,"d").replace(/\s+/g,"-").replace(r,e=>"aaaaaaaaacccddeeeeeeegghiiiiilmnnnnooooooprrsssssttuuuuuuuuuwxyyzzz------".charAt(a.indexOf(e))).replace(/&/g,"-and-").replace(/[^\w\-]+/g,"").replace(/\-\-+/g,"-").replace(/^-+/,"").replace(/-+$/,"")}

# Mò api App

https://m.apkpure.com/vn/httpcanary-%E2%80%94-http-sniffer-capture-analysis/com.guoshi.httpcanary

Nên dùng trên Android 7.0 đã ROOT
