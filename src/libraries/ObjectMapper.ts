import { merge } from 'object-mapper';

export class ObjectMapper {
  constructor(private map: object) { }

  process(source: object): object {
    return merge(source, this.map);
  }
}
