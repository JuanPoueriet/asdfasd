import { Injectable, signal, effect, Inject, PLATFORM_ID, inject, untracked } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { UsersService } from '@univeex/users/data-access';
import { AuthService } from '@univeex/auth/data-access';

const UI_LANG_KEY = 'ui_lang';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private isBrowser: boolean;
  private readonly supportedLangs = ['en', 'es'];
  private readonly defaultLang = 'es';

  private translate = inject(TranslateService);
  private usersService = inject(UsersService);
  private authService = inject(AuthService);

  public currentLang = signal<string>(this.defaultLang);

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.initializeLanguage();

    effect(() => {
      const lang = this.currentLang();
      this.translate.use(lang);

      if (this.isBrowser) {
        localStorage.setItem(UI_LANG_KEY, lang);
        document.documentElement.lang = lang;

        const currentUser = untracked(this.authService.currentUser);
        if (currentUser && currentUser.preferredLanguage !== lang) {
          this.syncWithUserProfile(currentUser.id, lang);
        }
      }
    });
  }

  private initializeLanguage(): void {
    this.translate.addLangs(this.supportedLangs);
    this.translate.setDefaultLang(this.defaultLang);
    const initialLang = this.getInitialLanguage();
    this.currentLang.set(initialLang);
  }

  public getInitialLanguage(): string {
    if (!this.isBrowser) {
      return this.defaultLang;
    }

    const storedLang = localStorage.getItem(UI_LANG_KEY);
    if (storedLang && this.supportedLangs.includes(storedLang)) {
      return storedLang;
    }

    const browserLang = this.translate.getBrowserLang()?.substring(0, 2);
    if (browserLang && this.supportedLangs.includes(browserLang)) {
      return browserLang;
    }

    return this.defaultLang;
  }

  public setLanguage(lang: string): void {
    if (this.supportedLangs.includes(lang) && lang !== this.currentLang()) {
      this.currentLang.set(lang);
    }
  }

  private async syncWithUserProfile(userId: string, lang: string): Promise<void> {
    try {
      await firstValueFrom(
        this.usersService.updateUser(userId, { preferredLanguage: lang })
      );
      console.log(`Preferencia de idioma del usuario ${userId} sincronizada a '${lang}'.`);
    } catch (error) {
      console.error('Falló la sincronización de la preferencia de idioma con el perfil del usuario.', error);
    }
  }
}
