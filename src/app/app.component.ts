import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, NgFor, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'Language-Translater';
  suggetions: string[] = [];
  TranslatedText = '';
  Languages = [{name: 'Telugu',value: 'te'},{name: 'Hindi',value: 'hi',},{name: 'Tamil',value: 'ta',},{name: 'Kannada',value: 'kn',}, ];
  Form = new FormGroup({
    inputText: new FormControl(''),
    translatedText: new FormControl(''),
    language: new FormControl(' '),
    suggest: new FormControl(' '),
  });
  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    this.Form.get('inputText')
      ?.valueChanges.pipe(debounceTime(300))
      .subscribe((value) => {
        this.getTranslatedText(value);
      });
    this.Form.get('suggest')?.valueChanges.subscribe((value: any) => {
      this.Form.patchValue({
        translatedText: this.Form.get('translatedText')?.value + ' ' + value,
      });
      this.Form.patchValue({ inputText: '' });
      this.suggetions = [];
    });
  }
  getTranslatedText(value: string | null) {
    if (value?.trim().length !== 0) {
      this.http
        .get(
          `https://inputtools.google.com/request?text=${value}&itc=${this.Form.value.language}-t-i0-und&num=13&cp=0&cs=1&ie=utf-8&oe=utf-8&app=demopage`
        )
        .subscribe((data: any) => {
          this.suggetions = data[1][0][1];
        });
    }
  }
  FinalText() {
    this.TranslatedText = this.Form.value.translatedText || '';
    this.Form.patchValue({ translatedText: '' });
  }
}
