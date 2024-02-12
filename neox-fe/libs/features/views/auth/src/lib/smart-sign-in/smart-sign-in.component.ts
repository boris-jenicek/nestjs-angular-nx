import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@ngneat/transloco';
import { ButtonComponent } from '@team-link/button';
import { APP_ROUTE, AUTH_ROUTE } from '@team-link/config';
import { AuthenticationService } from '@team-link/data-access';
import {
  FormControlStatus,
  FormGeneratorComponent,
  IFormCompactOutput,
} from '@team-link/form-generator';
import { ISignInForm, SignInFormService } from './sign-in-form.service';

@Component({
  selector: 'auth-sign-in',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoPipe,
    FormsModule,
    RouterLink,
    FormGeneratorComponent,
    ButtonComponent,
  ],
  providers: [SignInFormService],
  templateUrl: './smart-sign-in.component.html',
  styleUrl: './smart-sign-in.component.scss',
})
export class SmartSignInComponent {
  signUpRoute = ['/' + APP_ROUTE.AUTHENTICATION, AUTH_ROUTE.SIGN_UP];

  private userService = inject(AuthenticationService);
  public formService = inject(SignInFormService);

  login(data: IFormCompactOutput<ISignInForm>) {
    if (data.status === FormControlStatus.VALID) {
      this.userService.checkCredentials(data.value.email, data.value.password);
    }
  }
}
