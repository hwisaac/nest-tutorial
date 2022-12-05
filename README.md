# Learning NestJS by making an enterprise ready API

## nest 프로젝트 시작하기

콘솔에서

1. npm i -g @nestjs/cli
2. nest new
3. 프로젝트 명을 입력한다 : hi-nest
4. 패키지 매니저를 선택한다: npm
5. 해당 프로젝트를 vscode 로 시작한다.

## npm 명령어들

- `npm run start:dev` nest js 를 시작함

## main.ts 파일 살펴보기

- NestJs 는 main.ts 파일을 가지며 무조건 이 이름이어야 한다.
- bootstrap 라는 함수의 이름은 딴걸로 바꿔도 된다.
  - AppModule 은 클래스이다.
  - 데코레이터는 클래스에 함수 기능을 추가해준다. (즉 클래스 위의 함수)

```typescript
// main.ts

@Module({
  // 데코레이터
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

- AppController

```typescript
//app.AppController.ts
@Controller()
export class AppController {
  // AppService 안에 Hello World 문자열이 있다.
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```

```typescript
//app.service.ts
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
```

- AppService 는 함수들을 가진 클래스

## 구조와 아키텍쳐

- NestJs 는 컨트롤러를 비지니스 로직과 구분짓는다
- 컨트롤러는 url 을 가져오는 역할(GET), function 을 리턴(실행)시키는 역할
- 그 외 나머지 로직은 전부 AppService. 서비스는 실제로 function 을 가진다. ex) `getHello()`

```typescript
// app.service.ts 실제로 작동할 함수들
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  getHi(): string {
    return 'hi nest';
  }
}
```

```typescript
// app.controller.ts.
// url 과 실행될 함수를 연결하는 역할
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('/hello')
  sayHello(): string {
    // getHi말고 sayHello 라고적음(일치할 필요없음)
    return this.appService.getHi();
  }
}
```

- getHello 를 컨트롤러에 만들고 getHello를 서비스에 만들어야 한다.
- 하지만 getHi

## 프로젝트 초기화

- app.module.ts 에서 AppController와 AppService 삭제
- 파일은 main.ts 와 app.module.ts 둘 뿐

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

```typescript
// app.module.ts
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

## REST API
