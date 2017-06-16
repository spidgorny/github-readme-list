var ShowReadme = (function () {
    function ShowReadme() {
        var _this = this;
        this.loadRepos('lesik')
            .then(function (repos) {
            console.log(repos.length);
            repos.map(function (repoInfo) {
                _this.loadReadme(repoInfo.name)
                    .then(function (readmeData) {
                    _this.displayReadme(repoInfo, readmeData);
                });
            });
        })
            .catch(function (e) {
            console.error(e);
        });
    }
    ShowReadme.prototype.loadRepos = function (username) {
        var url = 'https://api.github.com/users/' + username + '/repos';
        return fetch(url)
            .then(function (response) {
            return response.json();
        });
    };
    ShowReadme.prototype.loadReadme = function (reponame) {
        var repoUrl = 'https://api.github.com/repos/lesik/' + reponame + '/readme';
        return fetch(repoUrl)
            .then(function (response) {
            return response.json();
        });
    };
    ShowReadme.prototype.displayReadme = function (repoInfo, readmeData) {
        var readmeText = this.b64DecodeUnicode(readmeData.content);
        var firstLine = readmeText.split("\n")[0];
        console.log(repoInfo.full_name, firstLine);
        var md = window.markdownit();
        var readmeHTML = md.render(readmeText);
        var div = document.createElement('div');
        div.innerHTML = "<h1>" + repoInfo.full_name + "</h1>\n\t\t<blockquote>\n\t\t\t" + readmeHTML + "\n\t\t</blockquote>\n\t\t";
        document.body.appendChild(div);
    };
    ShowReadme.prototype.b64DecodeUnicode = function (str) {
        // Going backwards: from bytestream, to percent-encoding, to original string.
        return decodeURIComponent(atob(str).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    };
    /**
     * @deprecated not supported by Chrome
     * @param str
     * @returns {any}
     */
    ShowReadme.prototype.base64EncodingUTF8 = function (str) {
        var encoded = new TextEncoderLite('utf-8').encode(str);
        var b64Encoded = base64js.fromByteArray(encoded);
        return b64Encoded;
    };
    return ShowReadme;
}());
new ShowReadme();
