// import { initEdgeStore } from '@edgestore/server';
// import { createEdgeStoreNextHandler } from "@edgestore/server/adapters/next/app";

// const es = initEdgeStore.create();  // Initializes the EdgeStore

// const edgeStoreRouter = es.router({   // Define router with available methods or functions
//   myPublicImages: es.imageBucket(),  // Example: Define an image bucket route
// });

// const handler = createEdgeStoreNextHandler({  // Create the handler with the defined router
//   router: edgeStoreRouter,
// });

// export { handler as GET, handler as POST };

// export type EdgeStoreRouter = typeof edgeStoreRouter;