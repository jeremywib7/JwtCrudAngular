import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError} from "rxjs";
import {UserAuthService} from "../_services/user-auth.service";
import {Router} from "@angular/router";
import {Injectable} from "@angular/core";
import {ToastrService} from "ngx-toastr";
import {UserService} from "../_services/user.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private userAuthService: UserAuthService, private router: Router, private toastr: ToastrService,
              private userService: UserService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.headers.get('No-Auth') === 'True') {
      return next.handle(req.clone());
    }

    const token = this.userAuthService.getToken();

    req = this.addToken(req, token);

    return next.handle(req).pipe(
      catchError(
        (err: HttpErrorResponse) => {
          if (err.status === 401) {
            this.userAuthService.clear();
            this.toastr.info("Please log in again", 'Session expired');
            this.router.navigate(['/login']);
          } else if (err.status === 403) {
            this.router.navigate(['/forbidden']);
          } else {
            this.toastr.error(err.error.message, 'Error');
          }
          return throwError("Something is wrong");
        }
      )
    );
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone(
      {
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true
      }
    );
  }

}
