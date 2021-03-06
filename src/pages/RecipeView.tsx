import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Ingredient, Recipe } from "../models";
import Helmet from "react-helmet";
import Modal from "react-modal";
import "../App.css";
import { Check, Type } from "react-feather";
import classNames from "classnames";

Modal.setAppElement("#root");

function Tag(props: { text: string }) {
  const url = "/tags/" + props.text;
  return <Link to={url}>{props.text}</Link>;
}

export function RecipeWrapper(props: { recipes: Recipe[] }) {
  const { id } = useParams<{ id: string }>();
  const x = Number(id);
  return <RecipeView {...props.recipes[x]} />;
}

function PrepStep(props: { text: string }) {
  const [st, setSt] = useState(false);

  const cn = classNames("prep-steps", {
    strikethrough: st,
  });

  return (
    <li className={cn}>
      <p className="prep-step-text">{props.text}</p>
      <Check onClick={() => setSt(!st)} />
    </li>
  );
}

function IngredientView(props: Ingredient) {
  const [st, setSt] = useState(false);

  const cn = classNames("ingredient", "p-ingredient", {
    "strikethrough": st
  })

// TODO: Add hrecipe unit stuff
return (
  <li className={cn} onClick={() => {setSt(!st)}}>
    {props.amount !== "" && (
      <span className="ingredient-amount">{props.amount}</span>
    )}
    <span className="ingredient-item">{props.item}</span>
  </li>
);
}

export default function RecipeView(props: Recipe) {
  const [textModalOpen, setTextModalOpen] = useState(false);

  const tagHTML = props.tags.map((tag, i) => {
    return (
      <span className="recipe-tag" key={i}>
        <Tag text={tag} />
        {i + 1 !== props.tags.length ? "," : ""}{" "}
      </span>
    );
  });

  const ingredients = props.ingredients.map((i: Ingredient) => {
    return <IngredientView {...i} />
  });

  const steps = props.steps.map((s) => {
    return <PrepStep text={s} />;
  });

  const imgURL = process.env.PUBLIC_URL + "/recipes/images/" + props.imgUrl;

  return (
    <article id="recipe" className="recipe hRecipe h-recipe">
      <RecipeMeta {...props} />
      <Modal isOpen={textModalOpen}>
        <pre>{props.raw}</pre>
        <button
          onClick={() => {
            setTextModalOpen(false);
          }}
        >
          Close modal
        </button>
      </Modal>
      <div className="recipe-title-bar">
        <h1 className="recipe-title fn p-name">{props.title}</h1>
        <div>
          <div
            onClick={() => {
              setTextModalOpen(true);
            }}
            className="meta-button"
          >
            <Type /> Raw Text
          </div>
        </div>
      </div>
      <header className="recipe-meta">
        {props.serves && (
          <span className="recipe-serves yield">
            <b>Yield</b> {props.serves}
          </span>
        )}
        {props.time && (
          <span className="recipe-time">
            <b>Time</b> {props.time}
          </span>
        )}
        {props.sourceURL && (
          <span>
            <b>Source</b>{" "}
            <a href={props.sourceURL} className="recipe-source">
              Link
            </a>
          </span>
        )}
        {props.sourceAuthor && (
          <span className="recipe-author">
            <b>By</b> {props.sourceAuthor}{" "}
          </span>
        )}
      </header>
      <div className="recipe-info">
        <p className="recipe-description p-summary summary">{props.bodyText}</p>
        <img
          className="recipe-picture u-photo photo"
          src={imgURL}
          alt={props.title}
        />
      </div>
      <div className="recipe-tags">{tagHTML}</div>
      <div className="recipe-body">
        <div className="recipe-ingredients">
          <h2>Ingredients</h2>
          <ul className="ingredients-list">{ingredients}</ul>
        </div>
        <div className="recipe-steps">
          <h2>Preparation</h2>
          <ol className="prep-steps instructions e-instructions">{steps}</ol>
        </div>
      </div>
      <RecipeJSONLD recipe={props} />
    </article>
  );
}

// TODO: expand this
function RecipeJSONLD(props: { recipe: Recipe }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    cookTime: props.recipe.time,
    description: props.recipe.bodyText,
    image: props.recipe.imgUrl,
    recipeIngredient: props.recipe.ingredients,
    name: props.recipe.title,
    recipeInstructions: props.recipe.steps.join(". "),
    recipeYield: props.recipe.serves,
  };
  return <script type="application/ld+json">{JSON.stringify(data)}</script>;
}

function RecipeMeta(props: Recipe) {
  const imgURL = process.env.PUBLIC_URL + "/recipes/images/" + props.imgUrl;

  return (
    <Helmet>
      <title>{props.title} - Cilantro</title>
      <meta content="article" property="og:type" />
      <meta content={props.title} property="og:title" />
      <meta content={props.bodyText} property="og:description" />
      <meta content={imgURL} property="og:image" />
      <meta property="og:site_name" content="Cilantro Recipes" />
      {props.sourceAuthor && (
        <meta property="og:author" content={props.sourceAuthor} />
      )}
      {props.sourceURL && <meta property="og:url" content={props.sourceURL} />}
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
}
