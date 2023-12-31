const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint

router.get("/", (req, res) => {
  Tag.findAll({
    attributes: ["id", "tag_name"],
    include: [
      {
        model: Product,
        attributes: ["id", "product_name", "price", "stock", "category_id"],
        through: ProductTag,
        as: "products",
      },
    ],
  })
    .then((dbTagData) => res.json(dbTagData))
    .catch((err) => {
      res.status(500).json(err);
    });
  // find all tags
  // be sure to include its associated Product data
});

router.get("/:id", (req, res) => {
  Tag.findOne(
    {
      where: {
        id: req.params.id,
      },
    },
    {
      include: [
        {
          model: Product,
          attributes: ["id", "product_name", "price", "stock", "category_id"],
          through: ProductTag,
          as: "products",
        },
      ],
    }
  )
    .then((dbTagData) => {
      if (!dbTagData) {
        res.status(404).json({ message: "No tag found with this id!" });
        return;
      }
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});
// find a single tag by its `id`
// be sure to include its associated Product data

router.post("/", (req, res) => {
  Tag.create({
    tag_name: req.body.tag_name,
  })
    .then((dbTagData) => res.json(dbTagData))
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.put("/:id", (req, res) => {
  Tag.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((dbTagData) => {
      if (!dbTagData[0]) {
        res.status(404).json({ message: "No tag found with this id!" });
        return;
      }
      res.json(dbTagData);
    })
    .catch((err) => {
      if (!dbTagData[0]) {
        res.status(404).json({ message: "No tag found with this id!" });
        return;
      }
    });
  // update a tag's name by its `id` value
});

router.delete("/:id", (req, res) => {
  Tag.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dbTagData) => {
      if (!dbTagData) {
        res.status(404).json({ message: "No tag found with this id!" });
        return;
      }
      res.json(dbTagData);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});
// delete on tag by its `id` value

module.exports = router;
