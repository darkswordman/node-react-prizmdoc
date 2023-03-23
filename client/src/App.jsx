import React, { useState, useEffect } from "react";
import "./App.css";
import ErrorBanner from "./ErrorBanner";
import PrizmDocViewerWrapper, { baseUrl } from "./PrizmDocViewerWrapper";

function App() {
  const [viewingSessionId, setViewingSessionId] = useState(null);
  const [error, setError] = useState(null);
  const [viewerControl, setViewerControl] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  /** Used to subscribe to events when the viewer control is initialized */
  useEffect(() => {
    if (viewerControl !== null) {
      console.log('new event')
      viewerControl.on("PageChanged", (e) => {
        setCurrentPage(e.pageNumber);
      });
    }
  }, [viewerControl]);

  // Ask the application server to create a viewing session for example.pdf.
  useEffect(() => {
    (async () => {
      try {
        // Tell the application server we want to begin viewing example.pdf. The
        // application server will create a new viewing session and return us
        // the viewingSessionId (which we need to instantiate the viewer below).
        const res = await fetch(
          `${baseUrl}/compareDocuments?document=example.pdf`,
          { method: "POST" }
        );

        // Make sure we received an HTTP 200 response.
        if (!res.ok) {
          throw new Error(
            `The request to the application server to create a new viewing session responded with: "${res.status} ${res.statusText}"`
          );
        }

        // Store the returned viewingSessionId so we can instantiate the viewer.
        setViewingSessionId((await res.json()).viewingSessionId);
      } catch (err) {
        setError(err);
      }
    })();
  }, []); // The empty array ensures this useEffect is only run once when the page first loads.

  // Render our page content.
  return (
    <>
      {!error && (
        <>
          <div
            style={{
              display: "flex",
              width: "100%",
              flexDirection: "row",
              gap: "10px",
            }}
          >
            <button>Version 1.0</button>
            <button>Version 2.0</button>
            <button>Version 3.0</button>
            <button>Version 4.0</button>
          </div>
          <PrizmDocViewerWrapper
            viewingSessionId={viewingSessionId} // Use the viewingSessionId as input to construct the viewer.
            style={{ width: "100%", height: "calc(100vh - 69.52px)" }} // Set the style of the container element which will become the viewer. The width and height will affect how much space the viewer will occupy.
            onViewerReady={setViewerControl} // Once the viewer is ready, update our component state to store a reference to the viewerControl so we can programmatically interact with it (see page navigation example below).
            on
          />
          <div style={{ display: "flex", width: "100%" }}>
            <input value={viewerControl?.getScaleFactor()} />
            <input value={viewerControl?.getPageNumber()} />
            <input value={currentPage} />
          </div>
          <div className="custom-pull-right">
            <button className="myCustomApprovedButton">Approve</button>
            <button
              className="pcc-icon pcc-icon-print"
              data-pcc-print="launch"
            ></button>
            <button
              data-pcc-download
              className="pcc-icon pcc-icon-download"
            ></button>
          </div>

          <div className="clientApiUsage">
            <p>
              And, once it is ready, you can programmatically interact with the
              viewer from a parent react component. Here are some buttons which
              make viewer API calls to perform programmatic page navigation:
            </p>
            <button
              disabled={!viewerControl}
              onClick={() => {
                viewerControl.changeToPrevPage();
              }}
            >
              Previous Page
            </button>
            <button
              disabled={!viewerControl}
              onClick={() => viewerControl.changeToNextPage()}
            >
              Next Page
            </button>
          </div>
        </>
      )}
      {error && <ErrorBanner message={error.toString()} />}
    </>
  );
}

export default App;
