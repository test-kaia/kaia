import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';

@Injectable()
export class FileService {

  options;
  domain = this.authService.domain;

  constructor(
    private authService: AuthService,
    private http: Http
  ) { }

  // Function to create headers, add token, to be used in jyoti requests
  createAuthenticationHeaders() {
    this.authService.loadToken(); // Get token so it can be attached to headers
    // Headers configuration options
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json', // Format set to JSON
        'authorization': this.authService.authToken // Attach token
      })
    });
  }

  deleteFiles(pathnames) {
console.log('deleteFiles() ' + JSON.stringify(pathnames));

    this.createAuthenticationHeaders();
    const url = this.domain + 'bin/deleteFile/' + this.authService.user.username + '/' + encodeURIComponent(JSON.stringify(pathnames));
    return this.http.delete(url, this.options).map(res => {
console.log(JSON.stringify(res.json()));
      return res.json();
    });
  }

  createMyDir(path) {
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'bin/createMyDir/' + this.authService.user.username
      + '/' + encodeURIComponent(path), {}, this.options).map(res => res.json());
  }

  getFileList(dirpath) {
    return this.getDirFileList(dirpath, 'file');
  }

  getDirList(dirpath) {
    return this.getDirFileList(dirpath, 'dir');
  }

  getDirFileList(dirpath, filetype) {
    this.createAuthenticationHeaders();

    var params: URLSearchParams = new URLSearchParams();
    if (filetype)
      params.set('filetype', filetype);

    this.options.search = params;

    const url = this.domain + 'bin/listFiles/' + this.authService.user.username + '/' + encodeURIComponent(dirpath);
    return this.http.get(url, this.options).map(res => {
//console.log(JSON.stringify(res.json()));
      return res.json() ;
    });

  }

    copyFiles(files: any, fromPath: string, toPath: string) {
        this.createAuthenticationHeaders();

        return this.http.post(this.domain + 'bin/copyFile/' + this.authService.user.username, {
            files: files,
            fromPath: fromPath,
            toPath: toPath
        }, this.options).map(res => res.json());
    }

    moveFiles(files: any, fromPath: string, toPath: string) {
        this.createAuthenticationHeaders();

        return this.http.post(this.domain + 'bin/moveFile/' + this.authService.user.username, {
            files: files,
            fromPath: fromPath,
            toPath: toPath
        }, this.options).map(res => res.json());
    }
}
