<template>
  <div class="bg-gray-900 text-gray-100 py-3.5 px-6 shadow flex justify-start">
    <div class="flex items-center cursor-pointer">
      <span class="text-green-500 text-xl mr-1"></span>
      <h1 class="text-xl">Razvan</h1>
    </div>

    <ul class="md:flex md:items-center">
      <li v-for="link in links" :key="link.name" class="md:mx-4">
        <a :href="link.link" class="text-xl hover:text-green-500">{{ link.name }}</a>
      </li>
    </ul>
  </div>
</template>


<script>
export default {
  name: 'AppNavbar',

  setup() {
    const links = [
      { name: "Home", link: "#" },
      { name: "Services", link: "#" },
      { name: "About", link: "#" },
      { name: "Blog", link: "#" },
      { name: "Contact", link: "#" },
    ];

    return {
      links,
    };
  },
};
</script>

<style scoped></style>
