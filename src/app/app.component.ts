import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, NgFor, NgIf,NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'Language-Translater';
  suggetions: string[] = [];
  finalTranslatedText = '';
  

  Languages = [
    { name: 'Telugu', value: 'te' },
    { name: 'Hindi', value: 'hi' },
    { name: 'Tamil', value: 'ta' },
    { name: 'Kannada', value: 'kn' },
  ];
  Form = new FormGroup({
    inputText: new FormControl(''),
    translatedText: new FormControl(''),
    language: new FormControl('Language'),
    suggest: new FormControl(''),
  });
  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    this.Form.get('inputText')
      ?.valueChanges.pipe(debounceTime(100))
      .subscribe((value) => {
        if (value?.length !== 0) {
          this.getTranslatedText(value).subscribe((data: any) => {
            this.Form.patchValue({ translatedText: data[1][0][1][0] });
          });
        } else {
          this.Form.patchValue({ translatedText: '' });
        }
      });

    this.Form.get('translatedText')?.valueChanges.subscribe((value: any) => {
      if (this.Form.get('translatedText')?.dirty === true) {
        
        
        let alphaString = '';
        for (let i of value?.split(' ')) {
          if (/[a-zA-Z]/.test(i)) {
            alphaString = i;
            break;
          }
        }
      
        if (alphaString.length !== 0) {
          this.getTranslatedText(alphaString).subscribe((data: any) => {
            this.suggetions = data[1][0][1];
          });
        }
      }
    });

    this.Form.get('suggest')?.valueChanges.subscribe((value: any) => {
      if (this.Form.get('suggest')?.value?.length !== 0) {
        const alphaText: any =this.Form.get('translatedText')?.value?.split(' ');
        let convertedText = '';
        for (let i in alphaText) {
          if (/[a-zA-Z]/.test(alphaText[i])) {
            convertedText = convertedText + value + ' ';
          } else {
            convertedText = convertedText + alphaText[i] + ' ';
          }
        }
        this.Form.get('translatedText')?.reset();
        this.Form.patchValue({
          translatedText: convertedText,
        });
        this.suggetions = [];
        this.Form.get('suggest')?.patchValue('');
      }
    });
  }

  getTranslatedText(value: string | null): any {
    return this.http.get(
      `https://inputtools.google.com/request?text=${value}&itc=${
        this.Form.value.language === 'Language' ? 'te' : this.Form.value.language
      }-t-i0-und&num=13&cp=0&cs=1&ie=utf-8&oe=utf-8&app=demopage`
    );
  }
  
  FinalText() {
    this.finalTranslatedText = this.Form.value.translatedText || '';
    this.Form.patchValue({ translatedText: '', inputText: '' });
  }
  
}
