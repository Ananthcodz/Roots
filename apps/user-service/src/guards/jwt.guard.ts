import {
  Injectable,
  ExecutionContext,
  UnauthorizedException
} from '@nestjs/common';
import { AuthGuard} from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class jwtGuard extends AuthGuard('jwt'){

  override canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  override handleRequest(err: any, user: any, info: any){
    if (err || !user){
      throw err || new UnauthorizedException('Invalid or expired token');
    }
    return user;
  }
}
