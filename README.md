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

## nest cli

- nest cli 를 설치했기 때문에 많은 것을 할 수 있다.
- 그중 하나 `generate|g` 커맨드 라인으로 nest의 모든것을 생성할 수 있음

### 컨트롤러 생성해보기

- 콘솔에 `nest g co` 입력해서 컨트롤러 생성
- 컨트롤러의 이름 설정: `movies`
- 그러면 src/movies 폴더가 만들어지고 컨트롤러가 생성됨
  - `movies/movies.controller.spec.ts` 테스트할때 쓰는 애(삭제해도됨)
  - `movies/movies.controller.ts` 컨트롤러
- app.module.ts 파일의 controllers 에는 해당 컨트롤러가 추가됨

```typescript
// app.moduel.ts
import { Module } from '@nestjs/common';
import { MoviesController } from './movies/movies.controller';

@Module({
  imports: [],
  controllers: [MoviesController],
  providers: [],
})
export class AppModule {}
```

#### movies 컨트롤러에 API 라우터 만들기

- `@Controller('movies')` url의 Entry Point 를 컨트롤한다. (라우터 역할)
- nestJS 는 무언가가 필요하면 요청을 해야만 한다.
- `getOne()`에서 요청하는 방법은 `parameter` 를 요청하는것: `@Param()` 파라미터 데코레이터를 사용한다.

```typescript
import { Controller, Get, Param } from '@nestjs/common';

@Controller('movies') // 'movies' 가 컨트롤러를 위한 url 을 만든다. '/movies' url 일 때 다음 문자열이 표시된다.
export class MoviesController {
  @Get()
  getAll() {
    return 'this will return all movies'; // url 이 '/movies'에서 나오는 문자
  }

  @Get('/:id') // url 이 '/movies/1234' 일 경우
  getOne(@Param('id') id: string) {
    // url 에 있는 id라는 parameter 를 얻길 원하면
    return `this will return one movie with id: ${id}`;
  }
}
```

```typescript
import { Controller, Get, Param } from '@nestjs/common';

@Controller('movies') // 'movies' 가 컨트롤러를 위한 url 을 만든다. '/movies' url 일 때 다음 문자열이 표시된다.
  getOne(@Param('id') movieId: string) {
    // url 에 있는 id라는 parameter 를 얻길 원하면
    return `this will return one movie with id: ${movieId}`;
  }

  getOne(@Param('id') id: string) {
    // url 에 있는 id라는 parameter 를 얻길 원하면
    return `this will return one movie with id: ${id}`;
  }
```

#### Post 데코레이터, Delete 데코레이터

- @Post() 는 기본적으로 movie 를 생성한다.
- @Delete() 는 삭제한다.
- @Patch() 는 삭제한다.
- @Put() 는 업데이트를 한다. (쓰지말자는 사람이 있음 리소스를 전부 교체하기때문)
- @Patch() 는 업데이트를 한다. (리소스의 일부분만 업데이트 하기 때문에 Put() 보단 Patch 를 사용 권장)

```typescript
  @Post()
  create() {
    return 'This will create a movie';
  }

  @Delete('/:id')
  remove(@Param('id') movieId: string) {
    return `This will delete a movie with the id: ${movieId}`;
  }

  @Patch('/:id')
  patch(@Param('id') movieId: string) {
    return `This will patch a movie with the id: ${movieId}`;
  }
```

- **주의** `/:id` 라우터 밑에 다른 라우트를 정의해버리면 id 를 입력한 것으로 인식하여 정상 작동하지 않으므로 위쪽에 정의하도록 하자

#### @Body 데코레이터

- 서버에 데이터를 전송한다고 해보자(json 바디로). 이를 사용할 때 @Body 데코레이터를 사용한다.

```typescript
@Post()
create(@Body() movieData){
  console.log(movieData)
}
```

```typescript
@Patch(':id')
  patch(@Param('id') movieId: string, @Body() updateData) {
    return {
      updatedMovie: movieId,
      ...updateData,
    };
  }
```

- `/movie` 에 `POST` 로 `{ "name":"tenet", "director":"nolan" }`json 데이터를 보내면 `movieData` 변수에 담겨서 그게 서버콘솔에 찍힌다.

## 전송되는 데이터(movieData)의 타입 정하기

- 서비스랑 컨트롤러에서 DTO 를 만들어야 한다.

### DTO ( data transfer object )

- src/movies/dto 폴더에 create.movie.dto.ts 파일을 만들자.

```typescript
// src/movies/dto/create.movied.dto.ts
export class CreateMovieDto {
  readonly title: string;

  readonly year: number;

  readonly genres: string[];
}
```

```typescript
// movies.controller.ts
import { CreateMovieDto } from './dto/create-movie.dto';

  @Post()
  create(@Body() movieData: CreateMovieDto) {
    return this.moviesService.create(movieData);
  }
```

### DTO 를 통해 데이터의 유효성 검사를 할 수 있다.

1. `npm i class validator class-transformer` 설치
2. CreateMovieDto 를 위한 데코레이터를 사용하자:
3. main.ts 에 `appGlobalPipes` 로 `ValidationPipe` 를 넘겨주자

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
```

- `whitelist:true` 데코레이터 없는 모든 property 의 객체를 거른다.(서버로 도달 못함)
- `forbidNonWhitelisted: true,` 이상한걸 보내면 요청 자체를 막아버림
- `transform:true` 유저들이 보낸 값(string)을 원하는 실제 타입(number)으로 바꿔줌
-

```typescript
// dto/create-movie.dto.ts
// createMovieDto 클래스의 유효성 검사
import { IsString, IsNumber } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  readonly title: string;

  @IsNumber()
  readonly year: number;

  @IsString({ each: true }) // 모든 요소를 하나씩 검사함
  readonly genres: string[];
}
```

## partial type 사용하기

- `npm i @nestjs/mapped-types` 설치
- mapped types 은 타입을 변환시키고 사용할 수 있게 한다

```typescript
// dto/update-movie.dto.ts

import { IsString, IsNumber } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateMovieDto } from './create-movie.dto';

export class UpdateMovieDto extends PartialType(CreateMovieDto) {}
```
