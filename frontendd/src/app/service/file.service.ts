import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  constructor(private http: HttpClient) { }

  // Function to write response into a text file
  writeResponseToFile(response: string, fileName: string): void {
    const blob = new Blob([response], { type: 'text/plain' });
    saveAs(blob, `${fileName}.txt`);
  }
}
