package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Blog;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Blog}.
 */
public interface BlogService {
    /**
     * Save a blog.
     *
     * @param blog the entity to save.
     * @return the persisted entity.
     */
    Blog save(Blog blog);

    /**
     * Partially updates a blog.
     *
     * @param blog the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Blog> partialUpdate(Blog blog);

    /**
     * Get all the blogs.
     *
     * @return the list of entities.
     */
    List<Blog> findAll();

    /**
     * Get the "id" blog.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Blog> findOne(Long id);

    /**
     * Delete the "id" blog.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
