const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

// The `/api/products` endpoint

// get all products
router.get("/", async (req, res) => {
  try {
    const dbProductData = await Product.findAll({
      attrubites: ["id", "product_name", "price", "stock", "category_id"],
      include: [
        {
          model: Category,
          attributes: ["id", "category_name"],
        },
        {
          model: Tag,
          through: ProductTag,
          as: "tags",
        },
      ],
    });

    res.json(dbProductData);
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
});

// get one product
router.get("/:id", (req, res) => {
  Product.findOne({
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: Category,
        attributes: ["id", "category_name"],
      },
      {
        model: Tag,
        through: ProductTag,
        as: "tags",
      },
    ],
  }).then((dbProductData) => {
    if (!dbProductData) {
      res.status(404).json({ message: "No category found with this id!" });
      return;
    }
    res.json(dbProductData);
  })
  .catch((err) => {
    res.status(500).json(err);
  });
});

// create new product
router.post("/", (req, res) => {
  Product.create(req.body)
  .then((product) => {
    // if there's product tags, we need to create pairings to bulk create in the ProductTag model
    if (req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id,
        };
      });
      return ProductTag.bulkCreate(productTagIdArr);
    }
    // if no product tags, just respond
    res.status(200).json(product);
  })
  .then((productTagIds) => res.status(200).json(productTagIds))
  .catch((err) => {
    console.log(err);
    res.status(400).json(err);
    /* req.body should look like this...
      {
        product_name: "Basketball",
        price: 200.00,
        stock: 3,
        tagIds: [1, 2, 3, 4]
      }
    */
  });
});

// update product
router.put("/:id", (req, res) => {
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
  .then((product) => {
    return ProductTag.findAll({ where: { product_id: req.params.id}});
  })
  .then((productTags) => {
    const productTagsIds = productTags.map(({ tag_id}) => tag_id);
    const newProductTag = req.body.tagIds .filter((tag_id) => {
      return {
        product_id: req.params.id,
        tag_id,
      };
    });
    const productTagsToDestroy = productTags .filter(({ tag_id}) => !req.body.tagIds.includes(tag_id)).map(({ id}) => id);

    // promise
    return Promise.all([
      ProductTag.bulkCreate(newProductTag),
      ProductTag.destroy({ where: { id: productTagsToDestroy}}),
    ]);
  }).then((revisedProductTags) => res.json(revisedProductTags)).catch((err) => {
    res.status(400).json(err);
  });
  // update product data


router.delete("/:id", (req, res) => {
  // delete one product by its `id` value
  Product.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dbProductData) => {
      if (!dbProductData) {
        res.status(404).json({ message: "No product found with this id!"})
        return;
      }
      res.json(dbProductData);
    })
    .catch((err) => res.status(500).json(err));
});
});

module.exports = router;
