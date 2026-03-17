import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

let logoInstanceCounter = 0;

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="logo-wrapper">
      <svg
        [attr.width]="height"
        [attr.height]="height"
        viewBox="0 0 52 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="logo-svg"
      >
        <defs>
          <linearGradient [attr.id]="uid + '-bg'" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1E90FF" />
            <stop offset="100%" stop-color="#0055CC" />
          </linearGradient>
          <linearGradient [attr.id]="uid + '-shine'" x1="0%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stop-color="rgba(255,255,255,0.2)" />
            <stop offset="100%" stop-color="rgba(255,255,255,0)" />
          </linearGradient>
          <linearGradient [attr.id]="uid + '-bolt'" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stop-color="#FFD700" />
            <stop offset="100%" stop-color="#FFA500" />
          </linearGradient>
        </defs>

        <!-- Background rounded square -->
        <rect x="2" y="2" width="48" height="48" rx="15" [attr.fill]="'url(#' + uid + '-bg)'" />

        <!-- Shine overlay -->
        <rect x="2" y="2" width="48" height="48" rx="15" [attr.fill]="'url(#' + uid + '-shine)'" />

        <!-- "N" letterform -->
        <path
          d="M14 36V16H18.5L28 29V16H32V36H27.5L18.5 23.5V36H14Z"
          fill="white"
          opacity="0.95"
        />

        <!-- Lightning bolt -->
        <path
          d="M34 14L30 24H35L31 34"
          [attr.stroke]="'url(#' + uid + '-bolt)'"
          stroke-width="2.8"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
        />

        <!-- Live indicator dot -->
        <circle cx="42" cy="12" r="4" fill="#FF3B30" />
        <circle cx="42" cy="12" r="1.8" fill="rgba(255,255,255,0.5)" />
      </svg>

      <div class="logo-text">
        <span class="logo-news" [style.fontSize.px]="height * 0.48">
          News<span class="logo-buzz">Buzz</span>
        </span>
      </div>
    </div>
  `,
  styles: [`
    .logo-wrapper {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
    }

    .logo-svg {
      display: block;
      filter: drop-shadow(0 2px 8px rgba(30, 144, 255, 0.25));
    }

    .logo-text {
      display: flex;
      flex-direction: column;
      line-height: 1;
    }

    .logo-news {
      font-family: 'Quicksand', sans-serif;
      font-weight: 800;
      letter-spacing: -0.5px;
      background: linear-gradient(135deg, #1E90FF 0%, #0055CC 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      user-select: none;
    }

    .logo-buzz {
      background: linear-gradient(135deg, #FFD700, #FFA500);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  `]
})
export class LogoComponent {
  @Input() height = 44;
  uid: string;

  constructor() {
    this.uid = 'logo-' + (logoInstanceCounter++);
  }
}
