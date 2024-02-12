import Image from "next/image";
import * as contentful from "contentful";

export default async function Home({ params }: { params: any }) {
  const components = await getContent(params.slug);
  return <div style={{ height: "100vh" }}>{components}</div>;
}

const getContent = async (params: string) => {
  const client = contentful.createClient({
    space: process.env.SPACE as string,
    accessToken: process.env.DELIVERY_KEY as string,
  });
  const entries = await client.getEntries({ content_type: "page", limit: 10 });

  const components = convertToReactComponents(entries.items, params);

  return components;
};

const convertToReactComponents = (entries: any, params: string) => {
  let page = {
    fields: { elements: [], sys: { contentType: { sys: { id: "" } } } },
  };
  for (const entry of entries) {
    if (entry.fields.slug === params) {
      page = entry;
    }
  }
  if (page.fields.elements.length === 0) {
    return <div>Page not found</div>;
  }
  const components: any[] = [];
  for (const el of page.fields.elements) {
    let element = el as contentful.Entry<any>;
    switch (element.sys.contentType.sys.id) {
      case "textElement":
        components.push(textElementTransformer(element.fields));
        break;
      case "image":
        console.log(element.fields);
        components.push(imageElementTransformer(element.fields));
        break;
      case "colorBlock":
        components.push(
          <div
            style={{
              position: "fixed",
              top: element.fields.top + "%",
              left: element.fields.left + "%",
              backgroundColor: element.fields.color as string,
              width: element.fields.width + "%",
              height: element.fields.height + "%",
              zIndex: -1,
            }}
          ></div>
        );
        break;

      default:
        break;
    }
  }
  return components;
};

const textElementTransformer = (fields: any) => {
  const { type, content, amplifiers, top, left } = fields;

  switch (type) {
    case "h1":
      return (
        <div style={{ position: "fixed", top: top + "%", left: left + "%" }}>
          <h1 key="yo">{content}</h1>
        </div>
      );
    case "h2":
      return (
        <div style={{ position: "fixed", top: top + "%", left: left + "%" }}>
          <h2>{content}</h2>
        </div>
      );
    case "h3":
      return (
        <div style={{ position: "fixed", top: top + "%", left: left + "%" }}>
          <h3>{content}</h3>
        </div>
      );
    case "body":
      return (
        <div style={{ position: "fixed", top: top + "%", left: left + "%" }}>
          <div>{content}</div>
        </div>
      );
    case "small":
      return (
        <div style={{ position: "fixed", top: top + "%", left: left + "%" }}>
          <small>{content}</small>
        </div>
      );
    default:
      return (
        <div style={{ position: "relative", top: top + "%", left: left + "%" }}>
          {content}
        </div>
      );
  }
};

const imageElementTransformer = (fields: any) => {
  const { image, width, height, top, left } = fields;
  return (
    <div
      key={height}
      style={{ position: "fixed", top: top + "%", left: left + "%" }}
    >
      <Image
        src={"https:" + image.fields.file.url}
        width={width}
        height={height}
        alt={image.fields.id}
      />
    </div>
  );
};
