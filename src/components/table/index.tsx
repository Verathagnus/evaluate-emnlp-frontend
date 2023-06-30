import { PlusIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useState, Fragment } from "react";
import { useAppDispatch, useAppSelector } from "../../store";

import Table, {
  AvatarCell,
  CategoryCell,
  DateCell,
  DeleteRecipe,
  DownloadPDFIngredient,
  EditRecipe,
  RecipeText,
  SelectColumnFilter,
  SelectDateFilter,
  StatusPill,
  TimeCell,
} from "./table";

const RecipesAdmin = () => {
  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Category",
        accessor: "category",
        Cell: CategoryCell,
        Filter: SelectDateFilter,
        filter: 'includes',
      },
      {
        Header: "Time To Cook",
        accessor: "timeToCook",
        Cell: TimeCell
      },
      {
        Header: "Image",
        accessor: "uploadedRecipeImageFileName",
        Cell: DownloadPDFIngredient,
        flagAccessor: "uploadedRecipeImageFlag",
      },
      {
        Header: "Edit Recipe",
        editAccessor: "_id",
        Cell: EditRecipe,
      },
      {
        Header: "Delete Recipe",
        accessor: "_id",
        Cell: DeleteRecipe,
      },
      {
        Header: "Recipe Text",
        accessor: "recipeText",
        Cell: RecipeText
      },
    ],
    []
  );
  return (
    <>
      <div id="recipe" className="w-full">
        <div className="max-w-[1180px] mx-auto relative">
          <div className="mt-5">
            <Table columns={columns} data={recipes} />
          </div>
        </div>
      </div>
    </>
  );
};

export default RecipesAdmin;
