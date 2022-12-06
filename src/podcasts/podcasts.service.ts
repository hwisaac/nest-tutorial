import { Injectable, NotFoundException } from '@nestjs/common';
import { Podcast } from './entities/podcast.entity';
import { Episode } from './entities/episode.entity';

@Injectable()
export class PodcastsService {
  private podcasts: Podcast[] = [];

  getAll(): Podcast[] {
    return this.podcasts;
  }
  getPodcast(id: string): Podcast {
    const podcast = this.podcasts.find((podcast) => podcast.id === +id);

    if (!podcast) {
      throw new NotFoundException(`Podcast with ID ${id} not found`);
    }
    return podcast;
  }

  deletePodcast(id: string) {
    const podcast = this.getPodcast(id);
    this.podcasts = this.podcasts.filter((podcast) => podcast.id !== +id);
  }
  create(podcastData) {
    this.podcasts.push({
      id: this.podcasts.length + 1,
      ...podcastData,
    });
  }
  update(id: string, updateData) {
    const podcast = this.getPodcast(id);
    this.deletePodcast(id);
    this.podcasts.push({ ...podcast, ...updateData });
  }

  // episodes

  getEpisodes(id) {
    const podcast = this.podcasts.filter((podcast) => podcast.id === id)[0];

    return podcast.episodes;
  }

  postEpisode(id, episodeData) {
    const podcast = this.getPodcast(id);
    podcast.episodes = [...episodeData];
  }

  patchEpisode(id: string, episodeId: string, episodeData: Episode) {
    const episodes = this.getEpisodes(id);
    for (let i = 0; i < episodes.length; i++) {
      if (episodes[i].episodeId === episodeId) {
        episodes[i] = { ...episodeData };
        return;
      }
    }
    return;
  }

  deleteEpisode(id, episodeId) {
    const podcast = this.getPodcast(id);
    podcast.episodes = [
      ...this.getEpisodes(id).filter((epi) => epi.episodeId !== episodeId),
    ];
    return;
  }

  // deleteOne(id: string) {
  //   this.getOne(id);
  //   this.movies = this.movies.filter((movie) => movie.id !== +id);
  // }

  // create(movieData) {
  //   this.movies.push({
  //     id: this.movies.length + 1,
  //     ...movieData,
  //   });
  // }

  // update(id: string, updateData) {
  //   const movie = this.getOne(id);
  //   this.deleteOne(id);
  //   this.movies.push({ ...movie, ...updateData });
  // }
}
