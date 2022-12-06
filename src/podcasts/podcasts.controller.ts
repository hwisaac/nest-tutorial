import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Patch,
  Body,
  Query,
} from '@nestjs/common';
import { PodcastsService } from './podcasts.service';
import { Podcast } from './entities/podcast.entity';

@Controller('podcasts')
export class PodcastsController {
  constructor(private readonly podcastsService: PodcastsService) {}

  //GET /podcasts
  @Get()
  getAll(): Podcast[] {
    console.log('hello');
    return this.podcastsService.getAll();
  }
  // POST /podcasts
  @Post()
  create(@Body() podcastData) {
    console.log(podcastData);
    this.podcastsService.create(podcastData);
    return 'podcastData';
  }
  // GET /podcasts/:id
  @Get(':id')
  getOne(@Param('id') id: string) {
    return `getOne ${id}}`;
  }
  // PATCH /podcasts/:id
  @Patch(':id')
  patch(@Param('id') id: string, @Body() updateData) {
    return this.podcastsService.update(id, updateData);
    return `patch ${id}`;
  }
  // DELETE /podcasts/:id
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.podcastsService.deletePodcast(id);
  }

  ////////////////////// episodes
  // GET /podcasts/:id/episodes
  @Get(':id/episodes')
  getEpisode(@Param('id') id: string) {
    return this.podcastsService.getEpisodes(id);
    // return `getEpisode: id= ${id}`;
  }
  // POST /podcasts/:id/episodes
  @Post(':id/episodes')
  postEpisode(@Param('id') id: string, @Body() episodeData) {
    return this.podcastsService.postEpisode(id, episodeData);
  }

  // PATCH /podcasts/:id/episodes/:episodeId
  @Patch(':id/episodes/:episodeId')
  patchEpisode(
    @Param('id') id: string,
    @Param('episodeId') episodeId: string,
    @Body() episodeData,
  ) {
    return this.podcastsService.patchEpisode(id, episodeId, episodeData);
  }

  // DELETE /podcasts/:id/episodes/:episodeId
  @Delete(':id/episodes/:episodeId')
  deleteEpisode(
    @Param('id') id: string,
    @Param('episodeId') episodeId: string,
  ) {
    return this.podcastsService.deleteEpisode(id, episodeId);
  }
}
