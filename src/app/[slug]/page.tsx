import Image from "next/image";
import * as contentful from 'contentful';

export default async function Home({params}) {

  const components = await getContent();
  return (
   <div>{components}</div>
  );
}

const getContent = async () => {
  const client = contentful.createClient({
    space: process.env.SPACE as string,
    accessToken: process.env.DELIVERY_KEY as string
  });
const entries = await client.getEntries({ content_type: 'page', limit: 10 })

const components = convertToReactComponents(entries.items);

return components;
}

const convertToReactComponents = (entries: any) => {


  let homepage = {fields: {elements: [], sys: {contentType: {sys: {id: ''}}}}};
  for (const entry of entries) {
    if (entry.fields.slug === 'home') {
      homepage = entry;
    }
  }
  const components: any[] = [];
  for (const el of homepage.fields.elements) {
    switch (el.sys.contentType.sys.id) {
      case 'textElement':
        components.push(
          textElementTransformer(el.fields)
        );
        break;
      case 'image':
        components.push(
          imageElementTransformer(el.fields)
        );
        break;

      default:
        break;
    }
  }
  return components;
}

const textElementTransformer = (fields: any) => {
  const {type, content, amplifiers, top, left} = fields;

  switch (type) {
    case 'h1':
      return <h1 key='yo' style={{position: 'fixed', top: top + 'px', left: left + 'px'}}>{content}</h1>;
    case 'h2':
      return <h2>{content}</h2>;
    case 'h3':
      return <h3>{content}</h3>;
    case 'body':
      return <div>{content}</div>;
    case 'small':
      return <small>{content}</small>;
    default:
      return <div>{content}</div>;
  }
}

const imageElementTransformer = (fields: any) => {
  const {image, width, height, top, left} = fields;
  return (
  <div key={height} style={{position: 'fixed', top: top + 'px', left: left + 'px'}}><Image src={'https:'+image.fields.file.url} width={width} height={height} alt={image.fields.id} /></div>
  )
}