
class ShowReadme {

	constructor() {
		this.loadRepos('lesik')
			.then((repos) => {
				console.log(repos.length);
				repos.map(repoInfo => {
					this.loadReadme(repoInfo.name)
						.then(readmeData => {
							this.displayReadme(repoInfo, readmeData);
						});
				});
			})
			.catch(e => {
				console.error(e);
			});
	}

	loadRepos(username: string) {
		const url = 'https://api.github.com/users/' + username + '/repos';
		return fetch(url)
			.then(response => {
				return response.json();
			});
	}

	loadReadme(reponame: string) {
		const repoUrl = 'https://api.github.com/repos/lesik/' + reponame + '/readme';
		return fetch(repoUrl)
			.then(response => {
				return response.json();
			});
	}

	displayReadme(repoInfo, readmeData: any) {
		const readmeText = this.b64DecodeUnicode(readmeData.content);
		const firstLine = readmeText.split("\n")[0];
		console.log(repoInfo.full_name, firstLine);
		const md = window.markdownit();
		const readmeHTML = md.render(readmeText);

		const div = document.createElement('div');
		div.innerHTML = `<h1>${repoInfo.full_name}</h1>
		<blockquote>
			${readmeHTML}
		</blockquote>
		`;
		document.body.appendChild(div);
	}

	b64DecodeUnicode(str) {
		// Going backwards: from bytestream, to percent-encoding, to original string.
		return decodeURIComponent(atob(str).split('').map(function(c) {
			return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
		}).join(''));
	}

	/**
	 * @deprecated not supported by Chrome
	 * @param str
	 * @returns {any}
	 */
	base64EncodingUTF8(str) {
		let encoded = new TextEncoderLite('utf-8').encode(str);
		let b64Encoded = base64js.fromByteArray(encoded);
		return b64Encoded;
	}

}

new ShowReadme();


