import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {catchError, Observable} from "rxjs";
import {UserAuthService} from "../_services/user-auth.service";
import {Router} from "@angular/router";

export class AuthInterceptor implements HttpInterceptor {
  // @ts-ignore
  constructor(private userAuthService: UserAuthService, private router: Router) {
  }

  // @ts-ignore
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.headers.get("No-Auth") === "True") {
      return next.handle(req.clone());
    }

    const token = this.userAuthService.getToken();

    req = this.addToken(req, token);

    return next.handle(req).pipe(
      catchError(
        (err: HttpErrorResponse) => {
          console.log(err.status);
          if (err.status === 401) {

          }
        }
      );
  )
    ;
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone(
      {
        setHeaders: {Authorization: `Bearer ${token}`}
      }
    );
  }
}
