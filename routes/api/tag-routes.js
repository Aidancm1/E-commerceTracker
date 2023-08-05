const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint

router.get("/", async (req, res) => {
  try {
    const tagData = await Tag.findAll();
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
  // find all tags
  // be sure to include its associated Product data
});

router.get("/:id", async (req, res) => {
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{ model: Tag, through: ProductTag, as: "tag_id" }],
    });
    if (!tagData) {
      res.status(404).json({ message: "No product tag found with this id!" });
      return;
    }
  } catch (err) {
    res.status(500).json(err);
  }
  // find a single tag by its `id`
  // be sure to include its associated Product data
});

router.post("/", async (req, res) => {
  try {
    const tagData = await Tag.create(req.body);
    res.status(200).json(tagData);
  } catch (err) {
    res.status(400).json(err);
  }
  // create a new tag
});

router.put("/:id", async (req, res) => {
  Tag.update(req.body, {
    where: {
      id: req.params.id,
    },
  }).then((tag) => {
    if (req.body.tagIds && req.body.tagIds.length) {
      Tag.findAll({
        where: { tag_id: req.params.id },
      }).then((tagIds) => {});
    }
  });
  // update a tag's name by its `id` value
});

router.delete("/:id", (req, res) => {
  // delete on tag by its `id` value
});

module.exports = router;
