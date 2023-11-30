import React from "react";
import PropTypes from "prop-types";

export default function MasjidInfoCard({
  item,
  onEdit,
  cardIconColor,
  cardIconName,
}) {
  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words max-w-screen-sm bg-white rounded mb-6 xl:mb-0 shadow-lg">
        <div className="flex-auto p-4">
          <div className="flex flex-wrap">
            <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
              <h5 className="text-blue-400 uppercase font-bold text-xs">
                {item.subtitle}
              </h5>
              <span className="font-semibold text-xl text-blue-700">
                {item.name}
              </span>
            </div>
            <div className="relative w-auto pl-4 flex-initial">
              <div
                className={
                  "p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full " +
                  cardIconColor
                }
                onClick={() => onEdit(item.id)}
              >
                <i className="fa fa-mosque"></i>
              </div>
            </div>
          </div>
          <p className="text-sm text-blue-400 mt-4">
            <span className=" mr-2">
              <i
                className="fa fas fa-edit"
              ></i>{" "}
            </span>
            <span className="whitespace-nowrap"></span>
          </p>
        </div>
      </div>
    </>
  );
}

MasjidInfoCard.defaultProps = {
  item: {},
  cardPercentColor: "text-emerald-500",
  cardIconName: "fas fa-edit",
  cardIconColor: "bg-teal-500",
};

MasjidInfoCard.propTypes = {
  item: PropTypes.object.isRequired,
  // can be any of the text color utilities
  // from tailwindcss
  cardPercentColor: PropTypes.string,
  cardIconName: PropTypes.string,
  // can be any of the background color utilities
  // from tailwindcss
  cardIconColor: PropTypes.string,
  onEdit: PropTypes.func.isRequired,
};
