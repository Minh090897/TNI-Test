import React from "react";
import Image from "next/image";

export default class Canvas extends React.Component {
  constructor(props) {
    super(props);

    this.canvas = React.createRef();
  }

  render() {
    return (
      <div className="relative w-full aspect-square">
        {/* PREDICTION IMAGES */}

        {!this.props.userUploadedImage &&
          this.props.prediction && (
              <Image
                alt={"prediction"}
                key={"prediction"}
                layout="fill"
                className="absolute animate-in fade-in"
                src={this.props.prediction.visualize}

              />
            )}


        {/* USER UPLOADED IMAGE */}
        {this.props.userUploadedImage && (
          <Image
            src={URL.createObjectURL(this.props.userUploadedImage)}
            alt="preview image"
            layout="fill"
          />
        )}

      </div>
    );
  }
}