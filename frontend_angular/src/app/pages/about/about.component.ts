import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ThemeService } from '../../services/theme.service';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {
  theme = inject(ThemeService);

  features: Feature[] = [
    {
      icon: 'trending_up',
      title: 'Trending News',
      description: 'Stay updated with the latest trending stories from across the globe, curated in real time.',
    },
    {
      icon: 'verified',
      title: 'Trusted Sources',
      description: 'We aggregate news from verified and reputable sources to ensure you get reliable information.',
    },
    {
      icon: 'devices',
      title: 'Multi-device',
      description: 'Access your news feed seamlessly across all your devices with a responsive, modern interface.',
    },
    {
      icon: 'tune',
      title: 'Personalized Feed',
      description: 'Choose your favorite topics to create a news feed tailored to your interests.',
    },
  ];
}
